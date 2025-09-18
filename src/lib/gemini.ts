const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not found');
  }

  const prompt = `Translate the following text to ${targetLanguage}: "${text}"`;

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to translate text');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.trim();
};
