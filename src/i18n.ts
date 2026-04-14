import { createI18n } from "vue-i18n";
import { configureTranslator } from "@/core/localization/translator";
import es from "./locales/es.json";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

const SUPPORTED_LOCALES = ["en", "es", "pt"];
const DEFAULT_LOCALE = "en";
const I18N_ENABLED = import.meta.env.VITE_I18N_ENABLED !== "false";

function getBrowserLocale() {
  const browserLang = navigator.language.toLowerCase();
  const matchedLocale = SUPPORTED_LOCALES.find((locale) =>
    browserLang.startsWith(locale)
  );
  return matchedLocale || DEFAULT_LOCALE;
}

const initialLocale = getBrowserLocale();

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  globalInjection: true,
  messages: I18N_ENABLED
    ? {
        en,
        es,
        pt,
      }
    : {
        en: {},
        es: {},
        pt: {},
      },
});

configureTranslator({
  t: (key, params) => {
    const translatedValue = i18n.global.t(key, params as never);

    if (translatedValue !== key) {
      return String(translatedValue);
    }

    if (params && !Array.isArray(params) && typeof params === "object" && "defaultMessage" in params) {
      return String(params.defaultMessage);
    }

    return String(translatedValue);
  },
  locale: () => String(i18n.global.locale.value ?? DEFAULT_LOCALE),
  enabled: () => I18N_ENABLED,
});

export default i18n;
export { I18N_ENABLED, DEFAULT_LOCALE };
