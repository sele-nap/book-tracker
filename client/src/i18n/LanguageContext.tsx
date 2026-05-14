import { useState } from 'react';
import { LanguageContext } from '../contexts/language';
import { type Locale, translations } from './translations';

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
