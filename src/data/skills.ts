import type { L10n } from '../i18n';

export const skillGroups: { label: string | L10n; items: (string | L10n)[] }[] = [
  { label: 'BACK-END', items: ['Ruby on Rails', 'Node.js', 'Python'] },
  { label: 'FRONT-END', items: ['ReactJS', 'JavaScript'] },
  { label: { pt: 'DADOS', en: 'DATA' }, items: ['SQL', 'MongoDB', 'Big Data'] },
  { label: { pt: 'AUTOMAÇÃO', en: 'AUTOMATION' }, items: ['Selenium WebDriver'] },
  {
    label: { pt: 'PRÁTICAS', en: 'PRACTICES' },
    items: [
      { pt: 'Padrões de design', en: 'Design patterns' },
      'Clean code',
      { pt: 'Revisão de código', en: 'Code review' },
      'Scrum',
    ],
  },
  { label: 'EXTRA', items: ['Marketing Digital'] },
];

export const spokenLanguages: { name: L10n; level: L10n; value: number }[] = [
  { name: { pt: 'Português', en: 'Portuguese' }, level: { pt: 'Nativo', en: 'Native' }, value: 100 },
  { name: { pt: 'Inglês', en: 'English' }, level: { pt: 'Intermediário/avançado', en: 'Upper-intermediate' }, value: 75 },
  { name: { pt: 'Espanhol', en: 'Spanish' }, level: { pt: 'Intermediário', en: 'Intermediate' }, value: 50 },
  { name: { pt: 'Italiano', en: 'Italian' }, level: { pt: 'Iniciante', en: 'Beginner' }, value: 15 },
];

export const certifications: (string | L10n)[] = [
  'Scrum Foundations Professional Certificate (SFPC)',
  'Digital Transformation Experience',
  {
    pt: 'Criando um Projeto com Interface Gráfica Utilizando a Linguagem Python',
    en: 'Building a GUI Project with Python',
  },
];
