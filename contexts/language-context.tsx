'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ar';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (key: string) => string;
};

const translations = {
  en: {
    'research.centers': 'Research Centers',
    'ask.me': 'Ask me',
    // Add more translations as needed
  },
  ar: {
    'research.centers': 'المراكز البحثية',
    'ask.me': 'اسألني',
    // Add more translations as needed
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const t = (key: string) => {
    return (
      translations[language][key as keyof (typeof translations)['en']] || key
    );
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
