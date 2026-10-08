import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Project = CollectionEntry<'projects'> & { slug: string; lang: Lang };

export type EncryptedPayload = {
  v: number;
  kdf: string;
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
};

const encrypted = import.meta.glob<EncryptedPayload>('../data/encrypted/*.json', { eager: true, import: 'default' });

export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getCollection('projects', (e) => e.id.endsWith(`.${lang}`));
  return entries
    .map((e) => ({ ...e, slug: e.id.slice(0, -(lang.length + 1)), lang }))
    .sort((a, b) => a.data.order - b.data.order);
}

export function getEncryptedPayload(slug: string, lang: Lang): EncryptedPayload | undefined {
  return encrypted[`../data/encrypted/${slug}.${lang}.json`];
}
