import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { translateText } from '@/lib/googleTranslate';

const TestTranslation = () => {
  const [text, setText] = useState('Hello, how are you?');
  const [targetLang, setTargetLang] = useState('hi');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTest = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await translateText(text, targetLang);
      setTranslated(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Google Translate API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Text to Translate</label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Language</label>
          <Input
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            placeholder="e.g., hi, bn, te"
          />
        </div>
        <Button onClick={handleTest} disabled={loading} className="w-full">
          {loading ? 'Translating...' : 'Test Translation'}
        </Button>
        {translated && (
          <div>
            <label className="block text-sm font-medium mb-1">Translated Text</label>
            <p className="p-2 bg-gray-100 rounded">{translated}</p>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm">
            Error: {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestTranslation;
