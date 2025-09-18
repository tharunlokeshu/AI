import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle, Sprout, Droplets, Bug, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CropPlan = () => {
  const { selectedCrop, userInputData } = useAuth();
  const [cropPlan, setCropPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCropPlan = async () => {
      if (!selectedCrop) {
        setError("Please select a crop first");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/crop-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cropName: selectedCrop,
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
      } catch (err) {
        console.error('Error fetching crop plan:', err);
        setError(err.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCropPlan();
  }, [selectedCrop, userInputData]);

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

  if (!selectedCrop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center">
        <Card className="bg-card/80 backdrop-blur-sm shadow-lg max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-primary">No Crop Selected</CardTitle>
            <CardDescription>
              Please select a crop from the Crop Advisory page first.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Link to="/crop-advisory">
                Go to Crop Advisory
              </Link>
            </Button>
          </CardContent>
        </Card>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {selectedCrop} Farming Plan
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

        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="mr-4">
            <Link to="/crop-advisory">
              Select Different Crop
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground">
            <Link to="/dashboard">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CropPlan;
