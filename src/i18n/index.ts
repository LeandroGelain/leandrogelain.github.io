import pt from './pt.json';
import en from './en.json';

export const languages = ['pt', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'pt';

const dictionaries = { pt, en } as const;
export type Dictionary = typeof pt;

export function useTranslations(lang: Lang): Dictionary {
  return dictionaries[lang];
}

export type PageKey = 'home' | 'about' | 'experience' | 'work' | 'stack' | 'contact';

/** Rotas equivalentes em cada idioma (slugs diferentes por idioma). */
export const routes: Record<PageKey, Record<Lang, string>> = {
  home: { pt: '/', en: '/en/' },
  about: { pt: '/sobre/', en: '/en/about/' },
  experience: { pt: '/experiencia/', en: '/en/experience/' },
  work: { pt: '/projetos/', en: '/en/work/' },
  stack: { pt: '/stack/', en: '/en/stack/' },
  contact: { pt: '/contato/', en: '/en/contact/' },
};

export const navOrder: PageKey[] = ['home', 'about', 'experience', 'work', 'stack', 'contact'];

export function projectPath(slug: string, lang: Lang): string {
  return `${routes.work[lang]}${slug}/`;
}

/** Valor bilíngue usado nos arquivos de dados. */
export type L10n<T = string> = { pt: T; en: T };
export const l = <T>(value: T | L10n<T>, lang: Lang): T =>
  value !== null && typeof value === 'object' && 'pt' in (value as object)
    ? (value as L10n<T>)[lang]
    : (value as T);
