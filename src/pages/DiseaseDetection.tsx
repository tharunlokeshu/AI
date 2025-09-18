import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";

interface DiseaseDetectionData {
  disease: string;
  confidence: string;
  severity: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatment: {
    immediate: string[];
    chemical: string[];
    preventive: string[];
  };
  timeline: string;
  recommendations: string[];
}

const DiseaseDetection = () => {
  const { selectedCrop } = useAuth();
  const { data, loading, error, callApi } = useApi<DiseaseDetectionData>();

  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetectDisease = () => {
    if (!imageBase64) return;
    callApi('/api/disease-detection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        cropType: selectedCrop,
      }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <h1 className="text-2xl font-bold mb-4">Crop Disease Detection for {selectedCrop || "Selected Crop"}</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <Button onClick={handleDetectDisease} disabled={!imageBase64} className="mt-4">
        Detect Disease
      </Button>

      {loading && <p>Detecting disease...</p>}
      {error && <p>Error detecting disease: {error}</p>}

      {data && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Disease: {data.disease || "No disease detected"}</CardTitle>
            <CardDescription>Severity: {data.severity}</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Description:</strong> {data.description}</p>
            <p><strong>Symptoms:</strong> {data.symptoms?.join(", ")}</p>
            <p><strong>Causes:</strong> {data.causes?.join(", ")}</p>
            <p><strong>Treatment:</strong></p>
            <ul>
              <li><strong>Immediate:</strong> {data.treatment?.immediate?.join(", ")}</li>
              <li><strong>Chemical:</strong> {data.treatment?.chemical?.join(", ")}</li>
              <li><strong>Preventive:</strong> {data.treatment?.preventive?.join(", ")}</li>
            </ul>
            <p><strong>Recommendations:</strong> {data.recommendations?.join(", ")}</p>
            <p><strong>Timeline:</strong> {data.timeline}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiseaseDetection;
