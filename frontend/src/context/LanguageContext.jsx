import React, { createContext, useContext, useState, useEffect } from 'react';
import tr from '../locales/tr';
import en from '../locales/en';
import de from '../locales/de';

const LanguageContext = createContext();

const translationsMap = {
  tr,
  en,
  de
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  const [translationsObj, setTranslationsObj] = useState(tr);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'tr';
    setCurrentLanguage(savedLanguage);
    setTranslationsObj(translationsMap[savedLanguage] || tr);
  }, []);

  const changeLanguage = (language) => {
    if (translationsMap[language]) {
      setCurrentLanguage(language);
      setTranslationsObj(translationsMap[language]);
      localStorage.setItem('language', language);
    }
  };

  const t = (key) => {
    return translationsObj[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      t,
      translations: translationsObj 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 