import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Sprout, DollarSign, Clock } from "lucide-react";

const CropAdvisory = () => {
  const recommendations = [
    {
      crop: "Cotton",
      suitability: "Highly Suitable",
      profit: "₹65,000",
      duration: "120 days",
      description: "Perfect match for your black soil and climate conditions. High market demand expected.",
      reasons: ["Excellent soil compatibility", "Favorable weather conditions", "Good water availability", "Strong market prices"]
    },
    {
      crop: "Soybean",
      suitability: "Very Suitable",
      profit: "₹45,000",
      duration: "90 days",
      description: "Great alternative crop with shorter growing period and good returns.",
      reasons: ["Quick harvest cycle", "Disease resistant varieties available", "Good for soil health", "Stable market demand"]
    },
    {
      crop: "Sunflower",
      suitability: "Suitable",
      profit: "₹35,000",
      duration: "75 days",
      description: "Low maintenance crop suitable for your water facility conditions.",
      reasons: ["Drought tolerant", "Low water requirement", "Multiple harvest seasons", "Oil processing opportunities"]
    }
  ];

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case "Highly Suitable": return "text-green-600 bg-green-50 border-green-200";
      case "Very Suitable": return "text-blue-600 bg-blue-50 border-blue-200";
      case "Suitable": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">Crop Advisory</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            AI-Powered Crop Recommendations
          </h2>
          <p className="text-lg text-muted-foreground">
            Based on your soil type, climate conditions, and farming preferences
          </p>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                      <Sprout className="h-6 w-6" />
                      {rec.crop}
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {rec.description}
                    </CardDescription>
                  </div>
                  <div className={`px-4 py-2 rounded-full border text-sm font-semibold ${getSuitabilityColor(rec.suitability)}`}>
                    {rec.suitability}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-lg text-center">
                    <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">{rec.profit}</div>
                    <div className="text-sm text-muted-foreground">Expected Profit per Acre</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg text-center">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">{rec.duration}</div>
                    <div className="text-sm text-muted-foreground">Growing Period</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg text-center">
                    <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">High</div>
                    <div className="text-sm text-muted-foreground">Market Demand</div>
                  </div>
                </div>

                {/* Reasons */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-primary">Why this crop is recommended:</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {rec.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-muted-foreground">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  <Link to="/crop-plan">
                    Create Farming Plan for {rec.crop}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CropAdvisory;