import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import koTranslations from "./locales/ko.json";
import zhTranslations from "./locales/zh.json";
import zhTranslations from "./locales/jp.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  ko: { translation: koTranslations },
  en: { translation: enTranslations },
  zh: { translation: zhTranslations },
  jp: { translation: jpTranslations },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ko",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
