import type { L10n } from '../i18n';

export type Experience = {
  role: string | L10n;
  company: string;
  place: string | L10n;
  period: L10n;
  /** Duração fixa; omitida quando `since` está presente (calculada no build). */
  duration?: L10n;
  /** Início do cargo atual (ano, mês 1–12). */
  since?: [number, number];
};

export const experience: Experience[] = [
  {
    role: { pt: 'Desenvolvedor Back-End Pleno', en: 'Mid-level Back-End Developer' },
    company: 'Nexaas',
    place: { pt: 'Remoto', en: 'Remote' },
    period: { pt: 'mar 2023 — Atual', en: 'Mar 2023 — Present' },
    since: [2023, 3],
  },
  {
    role: { pt: 'Desenvolvedor de Software Pleno', en: 'Mid-level Software Developer' },
    company: 'DPOnet',
    place: 'Pompéia, SP',
    period: { pt: 'jul 2021 — mar 2023', en: 'Jul 2021 — Mar 2023' },
    duration: { pt: '1 ano 9 meses', en: '1 yr 9 mos' },
  },
  {
    role: 'Partner',
    company: 'Leavening Accelerator',
    place: 'Marília, SP',
    period: { pt: 'set 2020 — mar 2023', en: 'Sep 2020 — Mar 2023' },
    duration: { pt: '2 anos 7 meses', en: '2 yrs 7 mos' },
  },
  {
    role: { pt: 'Desenvolvedor de Software Júnior', en: 'Junior Software Developer' },
    company: 'DPOnet',
    place: 'Pompéia, SP',
    period: { pt: 'jan 2021 — jul 2021', en: 'Jan 2021 — Jul 2021' },
    duration: { pt: '7 meses', en: '7 mos' },
  },
  {
    role: { pt: 'Estagiário de Desenvolvimento', en: 'Development Intern' },
    company: 'DPOnet',
    place: 'Pompéia, SP',
    period: { pt: 'mar 2020 — jan 2021', en: 'Mar 2020 — Jan 2021' },
    duration: { pt: '11 meses', en: '11 mos' },
  },
  {
    role: { pt: 'Programador de Software', en: 'Software Programmer' },
    company: 'Agro Academy',
    place: 'Marília, SP',
    period: { pt: 'mar 2019 — ago 2019', en: 'Mar 2019 — Aug 2019' },
    duration: { pt: '6 meses', en: '6 mos' },
  },
  {
    role: { pt: 'Big Data no Agronegócio', en: 'Big Data for Agribusiness' },
    company: 'Fatec Shunji Nishimura',
    place: { pt: 'Formação', en: 'Education' },
    period: { pt: '2018 — 2021', en: '2018 — 2021' },
    duration: { pt: 'Graduação', en: 'Degree' },
  },
];

/** Duração no estilo do LinkedIn (mês inicial e atual contam). */
export function durationSince([year, month]: [number, number], now = new Date()): L10n {
  const total = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month) + 1;
  const y = Math.floor(total / 12);
  const m = total % 12;
  const pt = [y && `${y} ${y === 1 ? 'ano' : 'anos'}`, m && `${m} ${m === 1 ? 'mês' : 'meses'}`];
  const en = [y && `${y} ${y === 1 ? 'yr' : 'yrs'}`, m && `${m} ${m === 1 ? 'mo' : 'mos'}`];
  return { pt: pt.filter(Boolean).join(' '), en: en.filter(Boolean).join(' ') };
}

/** Empresas distintas (exclui formação). */
export const companyCount = new Set(
  experience.filter((e) => e.company !== 'Fatec Shunji Nishimura').map((e) => e.company)
).size;
