import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use({
    type: 'backend',
    read(language: string, namespace: string, callback: (errorValue: unknown, translations: any) => void) {
      import(`../locales/${language}/${namespace}.json`)
        .then((resources) => {
          callback(null, resources.default);
        })
        .catch((error) => {
          callback(error, null);
        });
    }
  })
  .init({
    fallbackLng: 'id',
    supportedLngs: ['id', 'en'],
    ns: ['common', 'auth', 'dashboard', 'courses', 'materials', 'crossword', 'teacher', 'student', 'validation', 'dialog', 'toast', 'errors'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
