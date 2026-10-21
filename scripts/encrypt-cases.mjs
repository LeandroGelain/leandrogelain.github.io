#!/usr/bin/env node
// Criptografa os cases protegidos.
//
// Entrada:  src/content/protected/{slug}.{pt,en}.md   (texto claro, fora do git)
//           PROJECT_PW_{SLUG} no .env / ambiente       (senha, fora do git)
//           PROJECT_RELEASE_TOKEN_{SLUG}               (só para cases com `release`, ver buildDownload)
// Saída:    src/data/encrypted/{slug}.{lang}.json       ({ salt, iv, ciphertext, iterations }, commitado)
//
// O HTML gerado é criptografado com AES-256-GCM; a chave vem de PBKDF2-SHA256
// (600.000 iterações, salt aleatório de 16 bytes) e o IV é aleatório (12 bytes).
// Imagens referenciadas no markdown são embutidas como data-URI antes de criptografar.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCaseBlocks, escapeHtml } from '../src/lib/case-body.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src/content/protected');
const PUBLIC_STUBS = join(ROOT, 'src/content/projects');
const OUT = join(ROOT, 'src/data/encrypted');
const ITERATIONS = 600_000;

const COVER_PLACEHOLDER = { pt: '[ SCREENSHOT DO PROJETO ]', en: '[ PROJECT SCREENSHOT ]' };
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.svg': 'image/svg+xml' };

try { process.loadEnvFile(join(ROOT, '.env')); } catch { /* sem .env: usa o ambiente */ }

const { subtle } = globalThis.crypto;
const b64 = (buf) => Buffer.from(buf).toString('base64');

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    data[kv[1]] = value === 'true' ? true : value === 'false' ? false : value;
  }
  return { data, body: match[2] };
}

function toDataUri(relPath) {
  const file = resolve(SRC, relPath);
  const mime = MIME[extname(file).toLowerCase()];
  if (!mime) throw new Error(`Tipo de imagem não suportado: ${relPath}`);
  if (!existsSync(file)) throw new Error(`Imagem não encontrada: ${relPath}`);
  return `data:${mime};base64,${readFileSync(file).toString('base64')}`;
}

function inlineImages(html) {
  return html.replace(/(<img\b[^>]*?\bsrc=")([^"]+)(")/g, (all, pre, src, post) =>
    /^(data:|https?:)/.test(src) ? all : pre + toDataUri(src) + post
  );
}

// Botão de download, visível só após desbloquear. `downloadLabel` e `downloadNote` são opcionais.
// - `download`: link fixo.
// - `release` (owner/repo) + `releaseAsset` (regex do nome do arquivo, padrão `\.exe$`): arquivo
//   da release mais recente, consultada no navegador (src/lib/release-download.ts). O token
//   de leitura vai dentro do payload criptografado. `{version}` na nota vira a tag da release.
function buildDownload(data, release) {
  const label = escapeHtml(String(data.downloadLabel ?? 'Download'));
  const note = data.downloadNote ? escapeHtml(String(data.downloadNote)) : '';
  if (release) {
    const version = '<span data-release-version>…</span>';
    const text = note.includes('{version}') ? note.replaceAll('{version}', version) : [note, version].filter(Boolean).join(' · ');
    return `<div class="case-download" data-release-repo="${escapeHtml(release.repo)}" data-release-asset="${escapeHtml(release.asset)}" data-release-token="${escapeHtml(release.token)}"><button class="btn btn-primary" type="button" disabled>${label}</button><span class="case-download-note">${text}</span></div>`;
  }
  if (!data.download) return '';
  return `<div class="case-download"><a class="btn btn-primary" href="${escapeHtml(String(data.download))}" target="_blank" rel="noopener noreferrer">${label}</a>${
    note ? `<span class="case-download-note">${note}</span>` : ''
  }</div>`;
}

function buildHtml({ data, body }, lang, release) {
  const summary = data.summary ? `<p class="case-summary">${escapeHtml(String(data.summary))}</p>` : '';
  const cover = data.cover
    ? `<div class="case-cover${data.coverFull ? ' is-full' : ''}"><img src="${toDataUri(data.cover)}" alt="${escapeHtml(String(data.coverAlt ?? data.title ?? ''))}"></div>`
    : `<div class="case-cover placeholder">${COVER_PLACEHOLDER[lang]}</div>`;
  return `<div class="case-content">${summary}${buildDownload(data, release)}${cover}${inlineImages(renderCaseBlocks(body))}</div>`;
}

// Confere, com o mesmo token que vai para o navegador, que a release mais recente
// existe e tem o arquivo. Repositório privado responde 404 sem token (ou com token
// sem acesso), então o erro aponta para a variável.
async function checkRelease(repo, asset, token, envName) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error(`release "${repo}" deve estar no formato owner/repo`);
  if (token && !token.startsWith('github_pat_')) {
    throw new Error(`${envName} deve ser um token fine-grained (github_pat_…) só de leitura e só de ${repo}: ele fica acessível a quem tiver a senha do case.`);
  }
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers });
  if (!response.ok) {
    throw new Error(`${token ? envName : 'sem token,'} não lê a release mais recente de ${repo} (HTTP ${response.status})${token ? '' : `: defina ${envName} no .env`}.`);
  }
  const release = await response.json();
  const file = release.assets.find((a) => new RegExp(asset).test(a.name));
  if (!file) throw new Error(`a release ${release.tag_name} de ${repo} não tem arquivo que case com /${asset}/.`);
  // Quando o token expirar, o botão do case para de funcionar: gere outro e rode de novo.
  const expires = token ? response.headers.get('github-authentication-token-expiration') ?? 'sem expiração informada' : 'sem token';
  console.log(`  ${repo}: ${release.tag_name} → ${file.name} (${envName} expira em: ${expires})`);
}

async function encrypt(plaintext, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const baseKey = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const ciphertext = await subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
  return { v: 1, kdf: 'PBKDF2-SHA256', iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), ciphertext: b64(ciphertext) };
}

const files = existsSync(SRC) ? readdirSync(SRC).filter((f) => /^[a-z0-9-]+\.(pt|en)\.md$/.test(f)) : [];
if (!files.length) {
  console.log('Nenhum case protegido em src/content/protected/. Nada a fazer.');
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
let failed = false;

for (const file of files) {
  const [slug, lang] = file.split('.');
  const envName = `PROJECT_PW_${slug.toUpperCase().replace(/-/g, '_')}`;
  const password = process.env[envName];
  if (!password) {
    console.error(`✕ ${file}: defina ${envName} no .env`);
    failed = true;
    continue;
  }
  if (password.length < 12) console.warn(`! ${envName} tem menos de 12 caracteres — use uma senha mais longa.`);

  const stub = join(PUBLIC_STUBS, file);
  if (!existsSync(stub) || parseFrontmatter(readFileSync(stub, 'utf8')).data.protected !== true) {
    console.warn(`! ${file}: crie src/content/projects/${file} com os metadados públicos e "protected: true".`);
  }

  try {
    const source = parseFrontmatter(readFileSync(join(SRC, file), 'utf8'));
    let release;
    if (source.data.release) {
      const tokenEnv = `PROJECT_RELEASE_TOKEN_${slug.toUpperCase().replace(/-/g, '_')}`;
      release = { repo: String(source.data.release), asset: String(source.data.releaseAsset ?? '\\.exe$'), token: process.env[tokenEnv] ?? '' };
      await checkRelease(release.repo, release.asset, release.token, tokenEnv);
    }
    const html = buildHtml(source, lang, release);
    const payload = await encrypt(html, password);
    writeFileSync(join(OUT, `${slug}.${lang}.json`), JSON.stringify(payload) + '\n');
    console.log(`✓ ${file} → src/data/encrypted/${slug}.${lang}.json`);
  } catch (err) {
    console.error(`✕ ${file}: ${err.message}`);
    failed = true;
  }
}

// Sem process.exit(): chamado depois de um fetch (checkRelease), ele derruba o
// Node 24 no Windows (assertion em src\win\async.c) em vez de sair com o código.
process.exitCode = failed ? 1 : 0;
