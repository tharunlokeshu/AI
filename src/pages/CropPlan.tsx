import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, CheckCircle, Sprout, Droplets, Bug } from "lucide-react";

const CropPlan = () => {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [customCrop, setCustomCrop] = useState("");
  const [showPlan, setShowPlan] = useState(false);

  const cropOptions = [
    "Cotton", "Soybean", "Sunflower", "Wheat", "Rice", "Maize", "Sugarcane", "Groundnut"
  ];

  const samplePlan = [
    {
      week: "Week 1-2",
      phase: "Land Preparation",
      tasks: [
        "Deep plowing of the field",
        "Apply organic manure (5 tons per acre)",
        "Level the field properly",
        "Install irrigation system"
      ],
      icon: Sprout,
      color: "text-green-600 bg-green-50"
    },
    {
      week: "Week 3",
      phase: "Sowing",
      tasks: [
        "Seed treatment with fungicide",
        "Sow seeds at recommended spacing",
        "Apply basal fertilizer",
        "Initial irrigation"
      ],
      icon: Calendar,
      color: "text-blue-600 bg-blue-50"
    },
    {
      week: "Week 4-8",
      phase: "Vegetative Growth",
      tasks: [
        "Regular weeding (2-3 times)",
        "Apply nitrogen fertilizer",
        "Monitor for pests and diseases",
        "Maintain proper irrigation schedule"
      ],
      icon: Droplets,
      color: "text-cyan-600 bg-cyan-50"
    },
    {
      week: "Week 9-12",
      phase: "Flowering & Fruiting",
      tasks: [
        "Apply phosphorus and potassium",
        "Pest control measures",
        "Maintain adequate moisture",
        "Support plants if needed"
      ],
      icon: Bug,
      color: "text-orange-600 bg-orange-50"
    },
    {
      week: "Week 13-16",
      phase: "Maturity & Harvest",
      tasks: [
        "Monitor crop maturity indicators",
        "Reduce irrigation frequency",
        "Harvest at optimal time",
        "Post-harvest processing"
      ],
      icon: CheckCircle,
      color: "text-purple-600 bg-purple-50"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCrop || customCrop) {
      setShowPlan(true);
    }
  };

  const cropName = selectedCrop || customCrop;

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
        {!showPlan ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Create Your Crop Plan
              </h2>
              <p className="text-lg text-muted-foreground">
                Select a crop to get a detailed farming schedule
              </p>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle>Choose Your Crop</CardTitle>
                <CardDescription>
                  Select from recommended crops or enter a custom crop name
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="crop-select">Select Recommended Crop</Label>
                    <Select onValueChange={setSelectedCrop}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Choose from recommended crops" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropOptions.map((crop) => (
                          <SelectItem key={crop} value={crop}>
                            {crop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-center text-muted-foreground">
                    or
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-crop">Enter Custom Crop</Label>
                    <Input
                      id="custom-crop"
                      type="text"
                      placeholder="Enter crop name"
                      value={customCrop}
                      onChange={(e) => setCustomCrop(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                    disabled={!selectedCrop && !customCrop}
                  >
                    Generate Farming Plan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">
                {cropName} Farming Plan
              </h2>
              <p className="text-lg text-muted-foreground">
                Step-by-step schedule for optimal crop production
              </p>
            </div>

            <div className="space-y-6">
              {samplePlan.map((phase, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${phase.color}`}>
                        <phase.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-primary">
                          {phase.phase}
                        </CardTitle>
                        <CardDescription className="text-lg">
                          {phase.week}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {phase.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{task}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button 
                onClick={() => setShowPlan(false)}
                variant="outline" 
                className="mr-4"
              >
                Plan Another Crop
              </Button>
              <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground">
                <Link to="/dashboard">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CropPlan;