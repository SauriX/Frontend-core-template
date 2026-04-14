type TranslationParams = Record<string, unknown> | unknown[] | undefined;

interface TranslatorAdapter {
  t: (key: string, params?: TranslationParams) => string;
  locale: () => string;
  enabled: () => boolean;
}

const fallbackAdapter: TranslatorAdapter = {
  t: (key, params) => {
    if (params && !Array.isArray(params) && typeof params === "object" && "defaultMessage" in params) {
      return String(params.defaultMessage);
    }

    return key;
  },
  locale: () => "en",
  enabled: () => false,
};

let currentAdapter: TranslatorAdapter = fallbackAdapter;

export function configureTranslator(adapter: TranslatorAdapter) {
  currentAdapter = adapter;
}

export function translate(key: string, params?: TranslationParams): string {
  return currentAdapter.t(key, params);
}

export function getCurrentLocale(): string {
  return currentAdapter.locale();
}

export function isLocalizationEnabled(): boolean {
  return currentAdapter.enabled();
}
