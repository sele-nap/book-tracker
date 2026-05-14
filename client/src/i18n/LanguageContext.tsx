import { createContext, useContext, useState } from 'react';
import { type Locale, type Translations, translations } from './translations';

type LanguageContextType = {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale');
    const l: Locale = saved === 'fr' || saved === 'en' ? saved : 'fr';
    document.documentElement.lang = l;
    return l;
  });

  const handleSetLocale = (l: Locale) => {
    setLocale(l);
    localStorage.setItem('locale', l);
    document.documentElement.lang = l;
  };

  return (
    <LanguageContext.Provider
      value={{ locale, t: translations[locale], setLocale: handleSetLocale }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
