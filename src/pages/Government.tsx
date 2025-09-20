import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Building2, Phone, MapPin, Users, HelpCircle, FlaskConical } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";

interface GovernmentData {
  district: string;
  soilTestingLaboratories: any[];
  agricultureOfficers: any[];
  farmerSupportHelplines: any[];
  tipsNotes: string[];
  metadata: {
    dataSource: string;
    lastUpdated: string;
    searchQuery: string;
  };
}

interface SearchResult {
  district: string;
  type: string;
  name: string;
  location?: string;
  contact?: string;
  services?: string;
  role?: string;
  description?: string;
  details?: string;
}

interface SearchData {
  results: SearchResult[];
  count: number;
}

const Government = () => {
  const { userInputData } = useAuth();
  const { data, loading, error, callApi } = useApi<GovernmentData>();
  const { data: searchData, loading: searchLoading, error: searchError, callApi: callSearchApi } = useApi<SearchData>();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [activeTab, setActiveTab] = useState("location");

  useEffect(() => {
    if (userInputData && activeTab === "location") {
      callApi(`http://localhost:5002/api/government-organizations?district=${encodeURIComponent(userInputData.location)}`);
    }
  }, [userInputData, activeTab]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const searchParams = new URLSearchParams({
        q: searchQuery.trim(),
        ...(searchType !== "all" && { type: searchType })
      });
      callSearchApi(`http://localhost:5002/api/government-organizations/search?${searchParams}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading && activeTab === "location") return <div>Loading government organizations...</div>;
  if (error && activeTab === "location") return <div>Error loading government organizations: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Government Agricultural Services</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              By Location
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search All
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Organizations near {userInputData?.location}</h2>
              <p className="text-muted-foreground">Government agricultural services in your area</p>
            </div>

            {data && (
              <div className="space-y-6">
                {/* Soil Testing Laboratories */}
                {data.soilTestingLaboratories && data.soilTestingLaboratories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-blue-600" />
                      Soil Testing Laboratories
                    </h3>
                    <div className="grid gap-4">
                      {data.soilTestingLaboratories.map((lab, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <FlaskConical className="h-5 w-5 text-blue-600" />
                              {lab.laboratoryName}
                            </CardTitle>
                            <CardDescription>{lab.location}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{lab.contact}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <FlaskConical className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm">{lab.services}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agriculture Officers */}
                {data.agricultureOfficers && data.agricultureOfficers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Agriculture Officers
                    </h3>
                    <div className="grid gap-4">
                      {data.agricultureOfficers.map((officer, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-green-600" />
                              {officer.officerName}
                            </CardTitle>
                            <CardDescription>{officer.role}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{officer.contact}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm">{officer.description}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Farmer Support Helplines */}
                {data.farmerSupportHelplines && data.farmerSupportHelplines.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-orange-600" />
                      Farmer Support Helplines
                    </h3>
                    <div className="grid gap-4">
                      {data.farmerSupportHelplines.map((helpline, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <HelpCircle className="h-5 w-5 text-orange-600" />
                              {helpline.contact}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-start gap-2">
                              <HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <span className="text-sm">{helpline.details}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips and Notes */}
                {data.tipsNotes && data.tipsNotes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Agricultural Tips</h3>
                    <Card>
                      <CardContent className="pt-6">
                        <ul className="space-y-2">
                          {data.tipsNotes.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary font-bold">•</span>
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {!data && !loading && (
              <Card className="text-center py-8">
                <CardContent>
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No government organizations found for your location.</p>
                  <p className="text-sm text-muted-foreground mt-2">Try using the search tab to find organizations across all districts.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Government Organizations
                </CardTitle>
                <CardDescription>
                  Search for agricultural services across all Punjab districts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for labs, officers, helplines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={searchLoading || !searchQuery.trim()}>
                    {searchLoading ? "Searching..." : "Search"}
                  </Button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={searchType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("all")}
                  >
                    All Services
                  </Button>
                  <Button
                    variant={searchType === "soil" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("soil")}
                  >
                    <FlaskConical className="h-4 w-4 mr-1" />
                    Soil Labs
                  </Button>
                  <Button
                    variant={searchType === "officer" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("officer")}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Officers
                  </Button>
                  <Button
                    variant={searchType === "helpline" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchType("helpline")}
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Helplines
                  </Button>
                </div>
              </CardContent>
            </Card>

            {searchLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p>Searching government organizations...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {searchError && (
              <Card className="border-red-200">
                <CardContent className="pt-6">
                  <div className="text-red-600 text-center">Error searching organizations: {searchError}</div>
                </CardContent>
              </Card>
            )}

            {searchData && searchData.results && searchData.results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Found {searchData.count} result{searchData.count !== 1 ? 's' : ''}
                  </h3>
                </div>

                <div className="grid gap-4">
                  {searchData.results.map((result, idx) => (
                    <Card key={idx} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              {result.type === 'Soil Testing Laboratory' && <FlaskConical className="h-5 w-5 text-blue-600" />}
                              {result.type === 'Agriculture Officer' && <Users className="h-5 w-5 text-green-600" />}
                              {result.type === 'Farmer Support Helpline' && <HelpCircle className="h-5 w-5 text-orange-600" />}
                              {result.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">{result.type}</Badge>
                              <Badge variant="outline">{result.district}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {result.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{result.location}</span>
                          </div>
                        )}

                        {result.contact && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{result.contact}</span>
                          </div>
                        )}

                        {result.role && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{result.role}</span>
                          </div>
                        )}

                        {result.services && (
                          <div className="flex items-start gap-2">
                            <FlaskConical className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="text-sm">{result.services}</span>
                          </div>
                        )}

                        {result.description && (
                          <div className="flex items-start gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="text-sm">{result.description}</span>
                          </div>
                        )}

                        {result.details && (
                          <div className="flex items-start gap-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <span className="text-sm">{result.details}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : searchData && !searchLoading && (
              <Card className="text-center py-8">
                <CardContent>
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No results found for your search.</p>
                  <p className="text-sm text-muted-foreground mt-2">Try different keywords or search across all services.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Government;
