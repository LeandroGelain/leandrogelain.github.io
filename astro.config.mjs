// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync, readdirSync } from 'node:fs';
import rehypeFigures from './src/lib/rehype-figures.mjs';

// Slugs de cases protegidos (têm payload criptografado) ficam fora do sitemap.
const encryptedDir = new URL('./src/data/encrypted/', import.meta.url);
const protectedSlugs = new Set(
  (existsSync(encryptedDir) ? readdirSync(encryptedDir) : [])
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.split('.')[0])
);

export default defineConfig({
  site: 'https://leandrogelain.github.io',
  trailingSlash: 'always',
  // Endereço da versão antiga do site.
  redirects: {
    '/satellity-images/': '/projetos/satellity-images/',
  },
  markdown: {
    rehypePlugins: [rehypeFigures],
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const slug = page.match(/\/(?:projetos|en\/work)\/([^/]+)\/$/)?.[1];
        return !(slug && protectedSlugs.has(slug));
      },
    }),
  ],
});
