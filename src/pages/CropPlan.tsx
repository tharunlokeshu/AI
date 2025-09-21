import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle, Sprout, Droplets, Bug, AlertTriangle, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CropPlan = () => {
  const { selectedCrop, userInputData, recommendedCrops } = useAuth();
  const [cropPlan, setCropPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Always show crop selector first - ignore any previously selected crop
  const [showCropSelector, setShowCropSelector] = useState(true);
  const [localSelectedCrop, setLocalSelectedCrop] = useState("");

  // Use recommended crops from AuthContext instead of fetching separately
  const [cropsLoading, setCropsLoading] = useState(true);
  const [cropsError, setCropsError] = useState(null);

  // Get crop names from recommendedCrops (which come from CropAdvisory)
  const getCropNames = () => {
    if (recommendedCrops && recommendedCrops.length > 0) {
      return recommendedCrops.map(crop => crop.name);
    }
    // Return empty array if no recommendations available - user should visit CropAdvisory first
    return [];
  };

  // Handle loading state for recommendations
  useEffect(() => {
    if (recommendedCrops && recommendedCrops.length > 0) {
      setCropsLoading(false);
      setCropsError(null);
    } else if (recommendedCrops !== undefined) {
      // recommendedCrops is loaded but empty
      setCropsLoading(false);
    }
    // If recommendedCrops is still undefined, keep loading
  }, [recommendedCrops]);

  const fetchCropPlan = async (cropName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/crop-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: cropName,
          location: userInputData?.location || 'General',
          landSize: userInputData?.landSize || '1 acre',
          landType: userInputData?.landType || 'General',
          season: userInputData?.season || 'General',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch crop plan: ${errorText}`);
      }

      const data = await response.json();
      setCropPlan(data);
      setShowCropSelector(false);
      setLocalSelectedCrop(cropName);
      toast.success(`Crop plan generated for ${cropName}`);
    } catch (err) {
      console.error('Error fetching crop plan:', err);
      setError(err.message || 'Unknown error occurred');
      toast.error('Failed to generate crop plan');
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelect = (cropName) => {
    fetchCropPlan(cropName);
  };

  // Remove the useEffect that was automatically fetching plans for selectedCrop
  // Now users must always manually select a crop

  const getPhaseIcon = (phaseName) => {
    if (phaseName.toLowerCase().includes('preparation') || phaseName.toLowerCase().includes('sowing')) {
      return Sprout;
    } else if (phaseName.toLowerCase().includes('growth') || phaseName.toLowerCase().includes('vegetative')) {
      return Droplets;
    } else if (phaseName.toLowerCase().includes('flowering') || phaseName.toLowerCase().includes('fruiting')) {
      return Bug;
    } else if (phaseName.toLowerCase().includes('maturity') || phaseName.toLowerCase().includes('harvest')) {
      return CheckCircle;
    }
    return Calendar;
  };

  const getPhaseColor = (index) => {
    const colors = [
      "text-green-600 bg-green-50",
      "text-blue-600 bg-blue-50",
      "text-cyan-600 bg-cyan-50",
      "text-orange-600 bg-orange-50",
      "text-purple-600 bg-purple-50"
    ];
    return colors[index % colors.length];
  };

  // Show crop selector if no crop is selected or user wants to select a different crop
  if (showCropSelector) {
    const cropNames = getCropNames();

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
              <h1 className="text-xl font-bold text-primary">Select Crop for Planning</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Choose Your Crop</CardTitle>
                <CardDescription className="text-lg">
                  Select from crops recommended for {userInputData?.location || 'your region'} during {userInputData?.season || 'current season'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cropsLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-2 text-primary">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span>Loading crop recommendations...</span>
                    </div>
                  </div>
                ) : cropNames.length === 0 ? (
                  <div className="text-center py-12">
                    <Sprout className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                      No Crop Recommendations Available
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Please visit the Crop Advisory page first to get personalized crop recommendations based on your farm details.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button asChild>
                        <Link to="/crop-advisory">
                          <Sprout className="h-4 w-4 mr-2" />
                          Get Crop Recommendations
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cropNames.map((crop) => (
                      <Button
                        key={crop}
                        variant="outline"
                        className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleCropSelect(crop)}
                        disabled={loading}
                      >
                        <Sprout className="h-5 w-5" />
                        <span className="text-sm font-medium">{crop}</span>
                      </Button>
                    ))}
                  </div>
                )}

                {cropNames.length > 0 && (
                  <div className="mt-8 text-center">
                    <p className="text-muted-foreground">Select a crop from the recommendations above to get detailed farming plans.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

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
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">Crop Planning</h1>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCropSelector(true)}
            >
              <Sprout className="h-4 w-4 mr-2" />
              Select Different Crop
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {localSelectedCrop} Farming Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Step-by-step schedule for optimal crop production
          </p>
          {cropPlan && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg inline-block">
              <p className="text-primary font-semibold">
                Duration: {cropPlan.totalDuration || 'Not specified'}
              </p>
            </div>
          )}
        </div>

        {loading && <p className="text-center text-primary">Loading crop plan...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {cropPlan && cropPlan.phases && (
          <div className="space-y-6">
            {cropPlan.phases.map((phase, index) => {
              const IconComponent = getPhaseIcon(phase.phaseName);
              const colorClass = getPhaseColor(index);

              return (
                <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${colorClass}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-primary">
                          {phase.phaseName}
                        </CardTitle>
                        <CardDescription className="text-lg">
                          {phase.weekRange}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {phase.tasks && phase.tasks.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-primary mb-3">Tasks:</h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {phase.tasks.map((task, taskIndex) => (
                              <div key={taskIndex} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-foreground">{task.task}</span>
                                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                  <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                                    task.importance === 'High' ? 'bg-red-100 text-red-800' :
                                    task.importance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {task.importance}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {phase.milestones && phase.milestones.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-primary mb-3">Milestones:</h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {phase.milestones.map((milestone, milestoneIndex) => (
                              <div key={milestoneIndex} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-green-800">{milestone}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {cropPlan.generalTips && cropPlan.generalTips.length > 0 && (
              <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-primary">General Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {cropPlan.generalTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-800">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {cropPlan.warnings && cropPlan.warnings.length > 0 && (
              <Card className="bg-card/80 backdrop-blur-sm shadow-lg border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Important Warnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {cropPlan.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-red-600">{warning}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}


      </main>
    </div>
  );
};

export default CropPlan;
