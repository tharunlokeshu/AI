import { useCallback, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText } from '@/lib/googleTranslate';

interface TranslationCache {
  [key: string]: string;
}

const useTranslate = () => {
  const { language } = useLanguage();
  const [cache, setCache] = useState<TranslationCache>({});
  const [loading, setLoading] = useState(false);

  const translate = useCallback(async (text: string): Promise<string> => {
    if (language === 'en') return text; // No translation needed for English

    const cacheKey = `${language}-${text}`;
    if (cache[cacheKey]) return cache[cacheKey];

    setLoading(true);
    try {
      const translated = await translateText(text, language, 'en');
      setCache(prev => ({ ...prev, [cacheKey]: translated }));
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    } finally {
      setLoading(false);
    }
  }, [language, cache]);

  return { translate, loading };
};

export default useTranslate;
