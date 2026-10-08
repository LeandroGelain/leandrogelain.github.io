import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Um arquivo por idioma: `src/content/projects/{slug}.{pt,en}.md`.
 * Cases com `protected: true` têm aqui só os metadados públicos; o conteúdo
 * vem criptografado de `src/data/encrypted/` (veja scripts/encrypt-cases.mjs).
 */
const projects = defineCollection({
  loader: glob({
    pattern: '*.{pt,en}.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      code: z.string(),
      title: z.string(),
      type: z.string(),
      year: z.string(),
      role: z.string(),
      stack: z.string(),
      order: z.number(),
      protected: z.boolean().default(false),
      /**
       * `blocks`: cada `## Título` vira uma coluna (Desafio / Abordagem / Resultado).
       * `article`: texto corrido com imagens, para cases longos.
       */
      layout: z.enum(['blocks', 'article']).default('blocks'),
      summary: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      thumb: image().optional(),
    }),
});

export const collections = { projects };
