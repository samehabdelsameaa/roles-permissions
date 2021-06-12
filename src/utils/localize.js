import i18next from 'i18next';

console.log('i18next', i18next);

export const localize = (property1, property2, lang) => {
  return lang === 'en' ? property1 : property2;
};
