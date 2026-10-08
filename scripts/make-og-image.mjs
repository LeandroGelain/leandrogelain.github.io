#!/usr/bin/env node
// Gera public/og-image.png (1200×630): nome sobre o fundo do site + grade em perspectiva.
// Rode de novo só se mudar o visual: `node scripts/make-og-image.mjs`.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
const W = 1200, H = 630, HORIZON = 400, VP = W / 2;

// Grade em perspectiva desenhada à mão (linhas convergindo para o ponto de fuga).
const lines = [];
for (let i = -24; i <= 24; i++) {
  const xBottom = VP + i * 110;
  lines.push(`<line x1="${VP + i * 14}" y1="${HORIZON}" x2="${xBottom}" y2="${H}" />`);
}
for (let k = 0; k < 12; k++) {
  const y = HORIZON + (H - HORIZON) * Math.pow(k / 11, 1.9);
  lines.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" />`);
}

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="r1" cx="85%" cy="-10%" r="75%"><stop offset="0" stop-color="#2e1220"/><stop offset="1" stop-color="#2e1220" stop-opacity="0"/></radialGradient>
    <radialGradient id="r2" cx="0%" cy="60%" r="65%"><stop offset="0" stop-color="#042F40"/><stop offset="1" stop-color="#042F40" stop-opacity="0"/></radialGradient>
    <linearGradient id="fade" x1="0" y1="1" x2="0" y2="0"><stop offset=".1" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="m"><rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#fade)"/></mask>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#0F1026"/>
  <rect width="${W}" height="${H}" fill="url(#r1)"/>
  <rect width="${W}" height="${H}" fill="url(#r2)"/>
  <g stroke="#3f85a8" stroke-width="1.2" opacity=".55" mask="url(#m)">${lines.join('')}</g>
  <rect x="80" y="92" width="16" height="16" fill="#EE4B62" filter="url(#glow)"/>
  <text x="114" y="107" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="20" font-weight="500" letter-spacing="3.6" fill="#e6f1fb">L. GELAIN</text>
  <text x="240" y="107" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="17" letter-spacing="2" fill="#6f93ab">// DEV.FULLSTACK</text>
  <text x="78" y="250" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="96" font-weight="500" letter-spacing="-3.4" fill="#e6f1fb">Leandro Gelain</text>
  <text x="80" y="320" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="26" letter-spacing="5" fill="#f7a1ad">SOFTWARE ENGINEER · FULL STACK</text>
  <rect x="80" y="352" width="56" height="2" fill="#EE4B62"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log(`✓ ${out}`);
