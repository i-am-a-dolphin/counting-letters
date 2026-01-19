import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import koTranslations from "./locales/ko.json";
import zhTranslations from "./locales/zh.json";
import jaTranslations from "./locales/ja.json";
import thTranslations from "./locales/th.json";

const SUPPORTED = ["ko", "en", "zh", "ja", "th"] as const;
type Lang = (typeof SUPPORTED)[number];

const DEFAULT_LANG: Lang = "ko";
const LS_KEY = "lang_pref";

function getLangFromPath(): Lang | null {
  const seg = window.location.pathname.split("/")[1];
  return (SUPPORTED as readonly string[]).includes(seg) ? (seg as Lang) : null;
}

function resolveInitialLanguage(): Lang {
  // ✅ URL이 최우선
  const pathLang = getLangFromPath();
  if (pathLang) return pathLang;

  // ✅ 사용자가 선택한 언어가 있으면 그 다음
  const saved = localStorage.getItem(LS_KEY);
  if (saved && (SUPPORTED as readonly string[]).includes(saved)) return saved as Lang;

  return DEFAULT_LANG;
}

const resources = {
  ko: { translation: koTranslations },
  en: { translation: enTranslations },
  zh: { translation: zhTranslations },
  ja: { translation: jaTranslations },
  th: { translation: thTranslations },
};

const initial = resolveInitialLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: initial,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// ✅ 이 한 줄이 “어딘가에서 ko로 덮어쓰는” 문제를 거의 다 잡음
i18n.changeLanguage(initial);

export default i18n;
