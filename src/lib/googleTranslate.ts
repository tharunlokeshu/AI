const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

export const translateText = async (text: string | string[], targetLanguage: string, sourceLanguage: string = 'en'): Promise<string | string[]> => {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    throw new Error('Google Translate API key not found');
  }

  const params = new URLSearchParams();
  params.append('target', targetLanguage);
  params.append('source', sourceLanguage);
  params.append('key', GOOGLE_TRANSLATE_API_KEY);

  const texts = Array.isArray(text) ? text : [text];
  texts.forEach(t => params.append('q', t));

  const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}&${params}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to translate text');
  }

  const data = await response.json();
  const translations = data.data.translations.map((t: any) => t.translatedText);

  return Array.isArray(text) ? translations : translations[0];
};
