import { createContext } from 'react';
import type { Locale, Translations } from '../i18n/translations';

export type LanguageContextType = {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);
