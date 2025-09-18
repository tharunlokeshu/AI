import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Phone, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Vendor {
  id: string;
  name: string;
  type: string;
  lat: string;
  lon: string;
  address: string;
  phone: string;
  website: string;
  gst_id?: string;
  source_url?: string;
}

const LocalMarket = () => {
  const { userInputData } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (userInputData?.location && !hasDownloaded) {
      // Auto-fetch and download vendors when location is available
      fetchAndDownloadVendors(userInputData.location);
    }
  }, [userInputData, hasDownloaded]);

  const parseVendorTable = (tableText: string): Vendor[] => {
    const lines = tableText.split('\n');
    const vendors: Vendor[] = [];

    // Find the table rows (skip header)
    const dataLines = lines.filter(line =>
      line.includes('|') &&
      !line.includes('Agricultural Vendors in') &&
      !line.includes('---') &&
      !line.includes('ID | Name | Type')
    );

    for (const line of dataLines) {
      const columns = line.split('|').map(col => col.trim()).filter(col => col);
      if (columns.length >= 8) {
        vendors.push({
          id: columns[0],
          name: columns[1],
          type: columns[2],
          lat: columns[3],
          lon: columns[4],
          address: columns[5],
          phone: columns[6],
          website: columns[7],
          gst_id: columns[8] || '',
          source_url: ''
        });
      }
    }

    return vendors;
  };

  const fetchAndDownloadVendors = async (location: string) => {
    if (!location) {
      setError("Location is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/scrape-agri-vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: location,
          search_radius_meters: 2000,
          max_results: 50,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Failed to fetch vendors");
        setLoading(false);
        return;
      }
      // Since backend now returns PDF, handle as blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create a link to download the PDF
      const a = document.createElement('a');
      a.href = url;
      a.download = `agricultural_vendors_${location.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // We cannot parse vendors from PDF easily, so clear vendors list
      setVendors([]);
      setHasDownloaded(true);
      setDownloadSuccess(true);
    } catch (err) {
      setError("Error fetching vendors");
    } finally {
      setLoading(false);
    }
  };

  const downloadVendorDocument = (vendors: Vendor[], location: string) => {
    let content = `Agricultural Vendors in ${location}\n\n`;
    content += `Total Vendors Found: ${vendors.length}\n\n`;

    vendors.forEach((vendor, index) => {
      content += `${index + 1}. ${vendor.name}\n`;
      content += `   Type: ${vendor.type}\n`;
      if (vendor.address && vendor.address !== 'N/A') {
        content += `   Address: ${vendor.address}\n`;
      }
      if (vendor.phone && vendor.phone !== '') {
        content += `   Phone: ${vendor.phone}\n`;
      }
      if (vendor.website && vendor.website !== '') {
        content += `   Website: ${vendor.website}\n`;
      }
      if (vendor.gst_id && vendor.gst_id !== '') {
        content += `   GST/ID: ${vendor.gst_id}\n`;
      }
      if (vendor.lat && vendor.lon && vendor.lat !== '' && vendor.lon !== '') {
        content += `   Coordinates: ${vendor.lat}, ${vendor.lon}\n`;
      }
      content += '\n';
    });

    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agricultural_vendors_${location.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAgain = () => {
    if (userInputData?.location && vendors.length > 0) {
      downloadVendorDocument(vendors, userInputData.location);
    }
  };

  if (!userInputData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 flex items-center justify-center">
        <p className="text-lg text-center max-w-md">
          Please provide your farm details first in the Crop Advisory page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Local Agricultural Vendors</h1>



        {error && (
          <Card className="mb-6 border-red-200">
            <CardContent className="pt-6">
              <div className="text-red-600 text-center">{error}</div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p>Searching for agricultural vendors...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {downloadSuccess && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-green-600 mb-2">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-green-800 font-semibold">PDF Downloaded Successfully!</p>
                <p className="text-green-600 text-sm mt-1">
                  Agricultural vendors data for {userInputData.location} has been saved as a PDF file.
                </p>
                <button
                  onClick={() => fetchAndDownloadVendors(userInputData.location)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Download Again
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {vendors.length > 0 && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Found {vendors.length} vendors in {userInputData.location}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor, index) => (
                <Card key={vendor.id || index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{vendor.name}</CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {vendor.type || 'Agricultural Vendor'}
                        </Badge>
                      </div>
                      <Building className="h-6 w-6 text-gray-400 flex-shrink-0 ml-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {vendor.address && vendor.address !== 'N/A' && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 leading-relaxed">{vendor.address}</span>
                      </div>
                    )}

                    {vendor.phone && vendor.phone !== '' && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <a
                          href={`tel:${vendor.phone}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {vendor.phone}
                        </a>
                      </div>
                    )}

                    {vendor.website && vendor.website !== '' && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}

                    {(vendor.lat && vendor.lon && vendor.lat !== '' && vendor.lon !== '') && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-500">
                          {parseFloat(vendor.lat).toFixed(4)}, {parseFloat(vendor.lon).toFixed(4)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LocalMarket;
