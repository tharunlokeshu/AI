import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { translateText } from '@/lib/googleTranslate';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const savedResources = localStorage.getItem('translatedResources');

    if (savedLanguage && savedResources && savedLanguage !== 'en') {
      const resources = JSON.parse(savedResources);
      i18n.addResourceBundle(savedLanguage, 'translation', resources);
      setLanguageState(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      setLanguageState('en');
      i18n.changeLanguage('en');
    }
  }, []);

  const setLanguage = async (lang: string) => {
    setLoading(true);
    try {
      if (lang === 'en') {
        setLanguageState('en');
        localStorage.setItem('selectedLanguage', 'en');
        localStorage.removeItem('translatedResources');
        i18n.changeLanguage('en');
      } else {
        const enTranslations = i18n.services.resourceStore.data.en.translation;
        const keys = Object.keys(enTranslations);
        const values = Object.values(enTranslations) as string[];

        const translatedValues = await translateText(values, lang, 'en') as string[];

        const translatedObj: { [key: string]: string } = {};
        keys.forEach((key, index) => {
          translatedObj[key] = translatedValues[index];
        });

        i18n.addResourceBundle(lang, 'translation', translatedObj);
        setLanguageState(lang);
        localStorage.setItem('selectedLanguage', lang);
        localStorage.setItem('translatedResources', JSON.stringify(translatedObj));
        i18n.changeLanguage(lang);
      }
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to English
      setLanguageState('en');
      localStorage.setItem('selectedLanguage', 'en');
      localStorage.removeItem('translatedResources');
      i18n.changeLanguage('en');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};
