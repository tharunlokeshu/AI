import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Sprout, Download, CheckCircle, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface CropRecommendation {
  name: string;
  reason: string;
}

const CropAdvisory = () => {
  const { t } = useTranslation();
  const { userInputData, selectCrop, selectedCrop, setRecommendedCrops } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  // Fetch crop recommendations with persistence
  useEffect(() => {
    const fetchRecommendations = async () => {
      // Always set loading to true at the start
      setRecommendationsLoading(true);
      setError(null);

      if (!userInputData) {
        setError("Please provide your farm details first");
        setRecommendationsLoading(false);
        return;
      }

      // Check if we already have saved recommendations for this user input
      const savedRecommendationsKey = `cropRecommendations_${JSON.stringify(userInputData)}`;
      const savedRecommendations = localStorage.getItem(savedRecommendationsKey);

      if (savedRecommendations) {
        try {
          const crops = JSON.parse(savedRecommendations);
          setCropRecommendations(crops);
          setRecommendedCrops(crops);
          setRecommendationsLoading(false);
          return;
        } catch (err) {
          console.error('Error parsing saved recommendations:', err);
          localStorage.removeItem(savedRecommendationsKey);
        }
      }

      try {
        const response = await fetch('/api/recommended-crops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: userInputData.location,
            landSize: userInputData.landSize,
            landType: userInputData.landType,
            landHealth: userInputData.landHealth,
            season: userInputData.season,
            waterFacility: userInputData.waterFacility,
            duration: userInputData.duration
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const crops = data.crops || [];
          setCropRecommendations(crops);
          // Store recommendations in context for CropPlan to use
          setRecommendedCrops(crops);

          // Save recommendations to localStorage for persistence
          localStorage.setItem(savedRecommendationsKey, JSON.stringify(crops));
        } else {
          const errorText = await response.text();
          throw new Error(`Failed to fetch recommendations: ${errorText}`);
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userInputData]); // Fixed: Removed setRecommendedCrops from dependencies to prevent infinite loop

  // Download PDF report
  const downloadPDF = async () => {
    if (!userInputData) {
      toast.error("Please provide your farm details first");
      return;
    }

    setLoading(true);
    try {
      // Use the same crops that are displayed on the page for the PDF report
      const cropsToInclude = cropRecommendations.length > 0 ? cropRecommendations : [];

      const response = await fetch('/api/crop-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userInputData,
          language,
          crops: cropsToInclude // Include the crops in the request
        }),
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
        throw new Error(`Failed to download PDF: ${errorText}`);
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
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

          <Button
            onClick={downloadPDF}
            disabled={loading || !userInputData || cropRecommendations.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {loading ? t('loading') : 'Download PDF Report'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {t('aiPoweredRecommendations')}
          </h2>
          <p className="text-lg text-muted-foreground">
            Based on your farm details, here are the recommended crops for optimal yield and profitability.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center mb-8">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        )}

        {/* Loading State for Recommendations */}
        {recommendationsLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-primary">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-lg font-medium">Loading crop recommendations...</span>
            </div>
            <p className="text-muted-foreground mt-2">Analyzing your farm conditions and generating personalized suggestions</p>
          </div>
        )}

        {/* Crop Recommendations */}
        {!recommendationsLoading && !error && cropRecommendations.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {cropRecommendations.map((crop, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{crop.name}</CardTitle>
                      <CardDescription>Recommended Crop #{index + 1}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{crop.reason}</p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        This crop is recommended based on your farm's specific conditions including location, soil type, and seasonal factors.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Recommendations State */}
        {!recommendationsLoading && !error && cropRecommendations.length === 0 && (
          <div className="text-center py-12">
            <Sprout className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No crop recommendations available at the moment.</p>
          </div>
        )}

        {/* Additional Information */}
        <div className="mt-12 bg-card/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">About Your Recommendations</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">What These Recommendations Include:</h4>
              <ul className="space-y-1">
                <li>• Analysis of your farm's specific conditions</li>
                <li>• Market demand and profitability assessment</li>
                <li>• Seasonal and climatic suitability</li>
                <li>• Resource requirements and availability</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Next Steps:</h4>
              <ul className="space-y-1">
                <li>• Review each recommended crop carefully</li>
                <li>• Download the detailed PDF report for complete analysis</li>
                <li>• Select a crop to get detailed farming plans</li>
                <li>• Consult local agricultural experts for implementation</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CropAdvisory;
