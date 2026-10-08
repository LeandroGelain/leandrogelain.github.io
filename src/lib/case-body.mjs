// Renderiza o corpo markdown de um case em blocos (DESAFIO / ABORDAGEM / RESULTADO…).
// Compartilhado entre as páginas do Astro e scripts/encrypt-cases.mjs, para que o
// HTML descriptografado no navegador tenha exatamente a mesma estrutura.
import { marked } from 'marked';

/**
 * Cada `## Título` do markdown vira uma coluna `.case-block`.
 * Conteúdo antes do primeiro `##` é ignorado.
 * @param {string} markdown
 * @returns {string}
 */
export function renderCaseBlocks(markdown) {
  const parts = (markdown ?? '').split(/^##[ \t]+(.+)$/m);
  const blocks = [];
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i].trim();
    const html = marked.parse(parts[i + 1] ?? '', { async: false });
    blocks.push(`<section class="case-block"><h2>${escapeHtml(title)}</h2>${html}</section>`);
  }
  return blocks.length ? `<div class="case-blocks">${blocks.join('')}</div>` : '';
}

/** @param {string} s */
export function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
