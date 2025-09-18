import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";

interface Organization {
  name: string;
  address: string;
  contact: string;
}

interface GovernmentData {
  organizations: Organization[];
}

const Government = () => {
  const { userInputData } = useAuth();
  const { data, loading, error, callApi } = useApi<GovernmentData>();

  useEffect(() => {
    if (userInputData) {
      callApi('/api/government-organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: userInputData.location,
        }),
      });
    }
  }, [userInputData]);

  if (loading) return <div>Loading government organizations...</div>;
  if (error) return <div>Error loading government organizations: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <h1 className="text-2xl font-bold mb-4">Government Organizations near {userInputData?.location}</h1>
      {data && data.organizations && data.organizations.length > 0 ? (
        data.organizations.map((org, idx) => (
          <Card key={idx} className="mb-4">
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
              <CardDescription>{org.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contact: {org.contact}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No government organizations found for your location.</p>
      )}
    </div>
  );
};

export default Government;
