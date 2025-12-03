// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('vi');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'vi' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`⚠️ Translation not found: ${key} (stopped at: ${k})`);
        return key; // Return key if translation not found
      }
    }

    if (typeof value === 'string') {
      return value;
    } else {
      console.warn(`⚠️ Translation is not a string: ${key}`, value);
      return key;
    }
  };

  // Helper function to translate data from Vietnamese to English
  const translateData = (viText) => {
    // If language is Vietnamese, return original text
    if (language === 'vi' || !viText) return viText;

    // Get data translations - use type assertion to access data property
    const enTranslations = translations['en'] as any;
    const dataTranslations = (enTranslations && enTranslations['data']) || {};

    // Return translated text or original if not found
    return dataTranslations[viText] || viText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateData }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook for shorter syntax
export function useTranslation() {
  const { t } = useLanguage();
  return t;
}