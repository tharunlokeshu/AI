import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Upload, CheckCircle, AlertTriangle, Info } from "lucide-react";

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setShowResults(false);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAnalyzing(false);
    setShowResults(true);
  };

  const resetUpload = () => {
    setSelectedImage(null);
    setImagePreview("");
    setShowResults(false);
    setAnalyzing(false);
  };

  const sampleResults = {
    disease: "Leaf Spot Disease",
    confidence: "89%",
    severity: "Moderate",
    description: "Bacterial leaf spot is a common disease affecting crop leaves, causing circular spots with yellow halos.",
    treatment: {
      immediate: [
        "Remove affected leaves immediately",
        "Avoid overhead watering",
        "Improve air circulation around plants"
      ],
      chemical: [
        "Apply copper-based fungicide (Bordeaux mixture)",
        "Use streptomycin sulfate spray (200 ppm)",
        "Alternate with organic neem oil treatment"
      ],
      preventive: [
        "Use disease-resistant varieties",
        "Maintain proper plant spacing", 
        "Apply preventive copper spray every 2 weeks"
      ]
    },
    timeline: "Treatment should show results in 7-10 days"
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
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">Crop Disease Detection</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            AI-Powered Disease Detection
          </h2>
          <p className="text-lg text-muted-foreground">
            Upload crop images to detect diseases and get treatment recommendations
          </p>
        </div>

        {!selectedImage ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">Upload Crop Image</CardTitle>
                <CardDescription>
                  Take a clear photo of the affected plant or upload from your device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                  <Camera className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Choose Image</h3>
                  <p className="text-muted-foreground mb-6">
                    Drag and drop your image here, or click to browse
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </label>
                    </Button>
                    <Button asChild variant="outline">
                      <label htmlFor="camera-capture" className="cursor-pointer">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </label>
                    </Button>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    id="camera-capture"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                {/* Tips */}
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Tips for Best Results
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Take photos in good lighting conditions</li>
                    <li>• Focus on the affected part of the plant</li>
                    <li>• Include both healthy and diseased areas</li>
                    <li>• Ensure the image is clear and not blurry</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Analysis Section */
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Image Preview */}
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Uploaded Image
                  <Button onClick={resetUpload} variant="outline" size="sm">
                    Upload Different Image
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <img 
                    src={imagePreview} 
                    alt="Uploaded crop" 
                    className="max-w-full h-auto max-h-96 mx-auto rounded-lg shadow-md"
                  />
                  {!showResults && (
                    <Button 
                      onClick={analyzeImage}
                      disabled={analyzing}
                      className="mt-6 bg-primary hover:bg-primary-hover text-primary-foreground px-8"
                    >
                      {analyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                          Analyzing Image...
                        </>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Analyze for Diseases
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {showResults && (
              <div className="space-y-6">
                {/* Detection Results */}
                <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-orange-500" />
                      Detection Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-600">{sampleResults.disease}</div>
                        <div className="text-sm text-muted-foreground">Detected Disease</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">{sampleResults.confidence}</div>
                        <div className="text-sm text-muted-foreground">Confidence Level</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-600">{sampleResults.severity}</div>
                        <div className="text-sm text-muted-foreground">Severity Level</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-center">{sampleResults.description}</p>
                  </CardContent>
                </Card>

                {/* Treatment Recommendations */}
                <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      Treatment Recommendations
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Expected recovery time: {sampleResults.timeline}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg text-red-600">Immediate Actions</h4>
                        {sampleResults.treatment.immediate.map((action, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded">
                            <CheckCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg text-blue-600">Chemical Treatment</h4>
                        {sampleResults.treatment.chemical.map((treatment, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                            <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{treatment}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg text-green-600">Prevention</h4>
                        {sampleResults.treatment.preventive.map((prevention, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{prevention}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="text-center space-y-4">
                  <Button onClick={resetUpload} className="bg-primary hover:bg-primary-hover text-primary-foreground mr-4">
                    Analyze Another Image
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/local-market">
                      Find Pesticide Vendors
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DiseaseDetection;