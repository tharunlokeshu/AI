import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, TrendingUp, TrendingDown, Minus } from "lucide-react";

const LocalMarket = () => {
  const marketData = [
    {
      name: "Kakinada Central Mandi",
      location: "Kakinada, Andhra Pradesh",
      distance: "12 km",
      phone: "9876543210",
      crops: [
        { name: "Rice", price: "₹1,800", unit: "quintal", trend: "up" },
        { name: "Cotton", price: "₹5,200", unit: "quintal", trend: "up" },
        { name: "Groundnut", price: "₹4,500", unit: "quintal", trend: "stable" }
      ]
    },
    {
      name: "Rajahmundry Agricultural Market",
      location: "Rajahmundry, Andhra Pradesh",
      distance: "25 km",
      phone: "9876543211",
      crops: [
        { name: "Sugarcane", price: "₹285", unit: "ton", trend: "down" },
        { name: "Turmeric", price: "₹7,800", unit: "quintal", trend: "up" },
        { name: "Maize", price: "₹1,650", unit: "quintal", trend: "stable" }
      ]
    },
    {
      name: "Amalapuram Market Yard",
      location: "Amalapuram, Andhra Pradesh", 
      distance: "18 km",
      phone: "9876543212",
      crops: [
        { name: "Paddy", price: "₹1,750", unit: "quintal", trend: "up" },
        { name: "Black Gram", price: "₹6,200", unit: "quintal", trend: "stable" },
        { name: "Green Gram", price: "₹7,100", unit: "quintal", trend: "up" }
      ]
    }
  ];

  const vendors = [
    {
      name: "Sri Lakshmi Agri Traders",
      category: "Seeds & Fertilizers",
      contact: "9876543213",
      location: "Kakinada Main Road",
      services: ["Quality seeds", "Organic fertilizers", "Pesticides", "Farm equipment"]
    },
    {
      name: "Godavari Farm Supplies",
      category: "Equipment & Tools",
      contact: "9876543214", 
      location: "Rajahmundry Highway",
      services: ["Tractors", "Harvesting equipment", "Irrigation systems", "Maintenance"]
    },
    {
      name: "Green Valley Organics",
      category: "Organic Products",
      contact: "9876543215",
      location: "Amalapuram Circle",
      services: ["Organic fertilizers", "Bio-pesticides", "Vermicompost", "Consulting"]
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
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
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">Local Markets & Vendors</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Nearby Markets & Vendors
          </h2>
          <p className="text-lg text-muted-foreground">
            Current prices and vendor details in your area
          </p>
        </div>

        {/* Markets Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6">Agricultural Markets</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {marketData.map((market, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {market.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {market.location} • {market.distance} away
                  </CardDescription>
                  <div className="flex items-center gap-2 text-primary">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">{market.phone}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-lg mb-3">Current Prices</h4>
                  <div className="space-y-3">
                    {market.crops.map((crop, cropIndex) => (
                      <div key={cropIndex} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <span className="font-medium text-primary">{crop.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">per {crop.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{crop.price}</span>
                          <div className={getTrendColor(crop.trend)}>
                            {getTrendIcon(crop.trend)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Vendors Section */}
        <section>
          <h3 className="text-2xl font-bold text-primary mb-6">Agricultural Vendors</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {vendors.map((vendor, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{vendor.name}</CardTitle>
                  <CardDescription className="text-base font-medium text-accent">
                    {vendor.category}
                  </CardDescription>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="font-medium">{vendor.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{vendor.location}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-lg mb-3">Services Offered</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {vendor.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-primary hover:bg-primary-hover text-primary-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Vendor
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LocalMarket;