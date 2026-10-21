// Botão de download dos cases protegidos ligados a uma release do GitHub
// (`release` no frontmatter, ver scripts/encrypt-cases.mjs). Depois do
// desbloqueio, consulta a release mais recente com o token de leitura que veio
// no payload criptografado e baixa o arquivo pelo service worker
// public/download-sw.js, que contorna a falta de CORS no download do asset.

export type DownloadMessages = { working: string; error: string; unsupported: string };

type Asset = { name: string; url: string };
type Release = { tag_name: string; assets: Asset[] };

const SW_URL = '/download-sw.js';
const SW_SCOPE = '/download/';

let worker: Promise<ServiceWorker> | undefined;

function getWorker(): Promise<ServiceWorker> {
  if (!('serviceWorker' in navigator)) return Promise.reject(new Error('navegador sem service worker'));
  worker ??= navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE }).then((reg) => {
    if (reg.active) return reg.active;
    const sw = (reg.installing ?? reg.waiting)!;
    return new Promise<ServiceWorker>((resolve, reject) => {
      sw.addEventListener('statechange', () => {
        if (sw.state === 'activated') resolve(sw);
        if (sw.state === 'redundant') reject(new Error('service worker descartado'));
      });
    });
  });
  return worker;
}

async function latestAsset(repo: string, pattern: string, token: string): Promise<{ tag: string; asset: Asset }> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers, cache: 'no-store' });
  if (!response.ok) throw new Error(`releases/latest de ${repo}: HTTP ${response.status}`);
  const release = (await response.json()) as Release;
  const asset = release.assets.find((a) => new RegExp(pattern).test(a.name));
  if (!asset) throw new Error(`a release ${release.tag_name} não tem arquivo que case com /${pattern}/`);
  return { tag: release.tag_name, asset };
}

/** Entrega o pedido ao service worker e navega até /download/<id>, que vira o download. */
async function startDownload(asset: Asset, token: string, error: string): Promise<void> {
  const sw = await getWorker();
  const id = crypto.randomUUID();
  await new Promise<void>((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => reject(new Error('service worker não respondeu')), 5000);
    channel.port1.onmessage = () => {
      clearTimeout(timer);
      resolve();
    };
    sw.postMessage({ id, url: asset.url, token, error }, [channel.port2]);
  });
  location.assign(`${SW_SCOPE}${id}`);
}

async function setup(box: HTMLElement, messages: DownloadMessages): Promise<void> {
  const { releaseRepo: repo = '', releaseAsset: pattern = '\\.exe$', releaseToken: token = '' } = box.dataset;
  box.removeAttribute('data-release-token'); // o token fica só nesta closure
  const button = box.querySelector<HTMLButtonElement>('button')!;
  const note = box.querySelector<HTMLElement>('.case-download-note');
  const label = button.textContent ?? '';
  const fail = (message: string) => {
    button.disabled = true;
    if (note) note.textContent = message;
  };

  // O registro do worker corre junto com a consulta da release.
  const ready = getWorker();
  const latest = latestAsset(repo, pattern, token);
  try {
    await ready;
  } catch (error) {
    latest.catch(() => undefined);
    console.error('release-download:', error);
    return fail(messages.unsupported);
  }
  let found: { tag: string; asset: Asset };
  try {
    found = await latest;
  } catch (error) {
    console.error('release-download:', error);
    return fail(messages.error);
  }

  box.querySelectorAll('[data-release-version]').forEach((el) => (el.textContent = found.tag));
  button.title = found.asset.name;
  button.disabled = false;
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = messages.working;
    try {
      await startDownload(found.asset, token, messages.error);
    } catch (error) {
      console.error('release-download:', error);
      return fail(messages.unsupported);
    }
    // A navegação vira download e a página continua aberta: libera o botão de novo.
    setTimeout(() => {
      button.disabled = false;
      button.textContent = label;
    }, 3000);
  });
}

export function setupReleaseDownloads(root: HTMLElement, messages: DownloadMessages): void {
  root.querySelectorAll<HTMLElement>('[data-release-repo]').forEach((box) => void setup(box, messages));
}
