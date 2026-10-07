const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const MONTHS_S = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const uid = () => Math.random().toString(36).slice(2, 10);
export const TODAY = '2026-10-01';

export const fmtDate = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  return `${day} de ${MONTHS[m - 1]} de ${y}`;
};

export const fmtShort = (d: string) => {
  const [, m, day] = d.split('-').map(Number);
  return `${String(day).padStart(2, '0')} ${MONTHS_S[m - 1]}`;
};

export const getDow = (d: string) => DAYS[new Date(d + 'T12:00').getDay()];
export const getMonthS = (d: string) => MONTHS_S[Number(d.split('-')[1]) - 1];
