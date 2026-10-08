/** Configuração geral do site. */

/**
 * ID do formulário no Formspree (https://formspree.io → New form → copie o ID de
 * `https://formspree.io/f/<ID>`). Enquanto estiver vazio, o formulário mostra o
 * estado de erro com o link de e-mail.
 */
export const FORMSPREE_ID = '';

export const EMAIL = 'leandrogelain08@outlook.com';

export const CAREER_START_YEAR = 2019;

export const contactLinks = [
  { label: 'E-MAIL', value: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'WHATSAPP', value: '(14) 99622-0288', href: 'https://wa.me/5514996220288' },
  { label: 'LINKEDIN', value: 'in/leandro-gelain', href: 'https://www.linkedin.com/in/leandro-gelain' },
  { label: 'GITHUB', value: 'LeandroGelain', href: 'https://github.com/LeandroGelain' },
];
