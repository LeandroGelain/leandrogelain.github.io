import type { L10n } from '../i18n';

export const services: { code: string; title: L10n; text: L10n }[] = [
  {
    code: 'S.01',
    title: { pt: 'APIs & Back-end', en: 'APIs & Back-end' },
    text: {
      pt: 'Aplicações e APIs em Ruby on Rails e Node.js, bem estruturadas e fáceis de manter.',
      en: 'Ruby on Rails and Node.js apps and APIs, well-structured and easy to maintain.',
    },
  },
  {
    code: 'S.02',
    title: { pt: 'Interfaces em React', en: 'React interfaces' },
    text: {
      pt: 'Front-ends rápidos e componentizados, integrados ao seu back-end.',
      en: 'Fast, component-driven front-ends wired to your back-end.',
    },
  },
  {
    code: 'S.03',
    title: { pt: 'Automação', en: 'Automation' },
    text: {
      pt: 'Robôs e scripts em Python com Selenium para eliminar trabalho manual.',
      en: 'Python and Selenium bots and scripts that remove manual work.',
    },
  },
  {
    code: 'S.04',
    title: { pt: 'Dados', en: 'Data' },
    text: {
      pt: 'Modelagem SQL e MongoDB, integrações e pipelines de dados.',
      en: 'SQL and MongoDB modelling, integrations and data pipelines.',
    },
  },
];
