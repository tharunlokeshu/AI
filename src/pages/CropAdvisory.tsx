import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Sprout, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const CropAdvisory = () => {
  const { t } = useTranslation();
  const { userInputData, selectCrop, selectedCrop } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userInputData) {
        setError("Please provide your farm details first");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/crop-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...userInputData, language }),
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'crop_advisory_report.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          toast.success('PDF downloaded successfully!');
        } else {
          const errorText = await response.text();
          throw new Error(`Failed to fetch recommendations: ${errorText}`);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userInputData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToDashboard')}
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">{t('cropAdvisory')}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {t('aiPoweredRecommendations')}
          </h2>
          <p className="text-lg text-muted-foreground">
            Your farm advisory report is being generated and will be downloaded as a PDF.
          </p>
        </div>

        {loading && <p className="text-center text-primary">{t('loading')}</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="text-center">
            <Download className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">PDF has been downloaded to your device.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CropAdvisory;
