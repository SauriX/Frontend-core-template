// src/locales/schema.d.ts
import messages from './i18n.json';

export type MessageSchema = typeof messages['en'];

// Asegúrate de que esta lista contenga TODOS los códigos de idioma en tu JSON.
export type AvailableLocales = 'en' | 'es' | 'pt';