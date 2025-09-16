import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sprout, MapPin, Ruler, Leaf, TestTube, Calendar, Droplets, Clock } from "lucide-react";
import { toast } from "sonner";

const UserInput = () => {
  const [formData, setFormData] = useState({
    location: "",
    landSize: "",
    landType: "",
    landHealth: "",
    season: "",
    waterFacility: "",
    duration: "",
  });
  const [loading, setLoading] = useState(false);
  const { saveUserInputData } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      saveUserInputData(formData);
      toast.success("Farm details saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { key: "location", label: "Location", icon: MapPin, placeholder: "Enter your farm location", type: "input" },
    { key: "landSize", label: "Land Size", icon: Ruler, placeholder: "Enter land size (acres)", type: "input" },
    { 
      key: "landType", 
      label: "Land Type", 
      icon: Leaf, 
      type: "select",
      options: [
        { value: "alluvial", label: "Alluvial Soil" },
        { value: "red", label: "Red Soil" },
        { value: "black", label: "Black Soil" },
        { value: "sandy", label: "Sandy Soil" },
        { value: "loamy", label: "Loamy Soil" }
      ]
    },
    { key: "landHealth", label: "Land Health (pH, fertility, etc.)", icon: TestTube, placeholder: "Describe soil condition", type: "input" },
    { 
      key: "season", 
      label: "Season", 
      icon: Calendar, 
      type: "select",
      options: [
        { value: "kharif", label: "Kharif (Monsoon)" },
        { value: "rabi", label: "Rabi (Winter)" },
        { value: "zaid", label: "Zaid (Summer)" }
      ]
    },
    { 
      key: "waterFacility", 
      label: "Water Facility Availability", 
      icon: Droplets, 
      type: "select",
      options: [
        { value: "good", label: "Good" },
        { value: "average", label: "Average" },
        { value: "low", label: "Low" }
      ]
    },
    { 
      key: "duration", 
      label: "Farming Duration", 
      icon: Clock, 
      type: "select",
      options: [
        { value: "short", label: "Short term (1-3 months)" },
        { value: "medium", label: "Medium term (3-6 months)" },
        { value: "long", label: "Long term (6+ months)" }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Card className="bg-card/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Sprout className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Farm Details</CardTitle>
            <CardDescription>Tell us about your farm to get personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {formFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="flex items-center gap-2 text-sm font-medium">
                    <field.icon className="h-4 w-4 text-primary" />
                    {field.label}
                  </Label>
                  {field.type === "input" ? (
                    <Input
                      id={field.key}
                      type="text"
                      placeholder={field.placeholder}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  ) : (
                    <Select onValueChange={(value) => handleInputChange(field.key, value)} required>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground mt-8" 
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Farm Details"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserInput;