// Download dos arquivos de releases privadas do GitHub nos cases protegidos
// (src/lib/release-download.ts).
//
// O navegador não consegue baixar o asset de uma release privada com fetch: a
// API (api.github.com) libera CORS, mas o redirecionamento para o arquivo
// (release-assets.githubusercontent.com) não. Aqui o pedido autenticado sai com
// `redirect: 'manual'` e a resposta (opaqueredirect) vira a resposta da
// navegação para /download/<id>. Navegação não passa por CORS: o navegador
// segue o redirecionamento e baixa o arquivo pelo próprio gerenciador de downloads.
//
// Escopo /download/: o worker não intercepta nenhuma outra página do site.
const pending = new Map();

self.addEventListener('install', () => self.skipWaiting());

// A página manda { id, url, token, error } e espera a confirmação antes de navegar.
self.addEventListener('message', (event) => {
  const { id, url, token, error } = event.data ?? {};
  if (typeof id !== 'string' || typeof url !== 'string' || !url.startsWith('https://api.github.com/')) return;
  pending.set(id, { url, token, error });
  event.ports[0]?.postMessage('ok');
});

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Sem redirecionamento (token vencido, arquivo apagado, rede): página curta com
// o motivo, em vez do JSON de erro da API.
function failure(message, detail) {
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Download</title>
<body style="font:16px/1.6 system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 16px;background:#0F1026;color:#e6f1fb">
<p>${escapeHtml(message)}</p><p style="opacity:.6;font-size:13px">${escapeHtml(detail)}</p>
<p><a href="javascript:history.back()" style="color:#f7a1ad">←</a></p>`;
  return new Response(html, { status: 502, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.mode !== 'navigate' || url.origin !== self.location.origin || !url.pathname.startsWith('/download/')) return;
  const id = url.pathname.slice('/download/'.length);
  const job = pending.get(id);
  if (!job) return; // pedido desconhecido (ex.: worker reiniciado): segue para a rede
  pending.delete(id);
  const headers = { Accept: 'application/octet-stream', 'X-GitHub-Api-Version': '2022-11-28' };
  if (job.token) headers.Authorization = `Bearer ${job.token}`;
  event.respondWith(
    fetch(job.url, { headers, redirect: 'manual', credentials: 'omit', cache: 'no-store' }).then(
      (response) => (response.type === 'opaqueredirect' ? response : failure(job.error, `GitHub: HTTP ${response.status}`)),
      (error) => failure(job.error, String(error))
    )
  );
});
