import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";

interface Vendor {
  name: string;
  address: string;
  contact: string;
}

interface LocalMarketData {
  vendors: Vendor[];
}

const LocalMarket = () => {
  const { userInputData, selectedCrop } = useAuth();
  const { data, loading, error, callApi } = useApi<LocalMarketData>();

  useEffect(() => {
    if (userInputData && selectedCrop) {
      callApi('/api/local-market', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: userInputData.location,
          crop: selectedCrop,
        }),
      });
    }
  }, [userInputData, selectedCrop]);

  if (loading) return <div>Loading local market vendors...</div>;
  if (error) return <div>Error loading local market vendors: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <h1 className="text-2xl font-bold mb-4">Local Market Vendors for {selectedCrop}</h1>
      {data && data.vendors && data.vendors.length > 0 ? (
        data.vendors.map((vendor, idx) => (
          <Card key={idx} className="mb-4">
            <CardHeader>
              <CardTitle>{vendor.name}</CardTitle>
              <CardDescription>{vendor.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contact: {vendor.contact}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No vendors found for the selected crop and location.</p>
      )}
    </div>
  );
};

export default LocalMarket;
