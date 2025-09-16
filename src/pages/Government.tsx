import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Phone, MapPin, Globe, Users } from "lucide-react";

const Government = () => {
  const organizations = [
    {
      name: "Rythu Bharosa Kendra - Kakinada",
      type: "Agricultural Extension Center",
      address: "Main Road, Kakinada, Andhra Pradesh - 533001",
      phone: "08842-234567",
      services: [
        "Crop advisory services",
        "Soil testing facilities", 
        "Seed distribution",
        "Fertilizer subsidies",
        "Insurance schemes",
        "Technical training"
      ],
      timings: "Mon-Sat: 9:00 AM - 5:00 PM",
      distance: "8 km"
    },
    {
      name: "District Collector Office - East Godavari",
      type: "Administrative Office",
      address: "Collectorate Complex, Kakinada, Andhra Pradesh",
      phone: "08842-245678",
      services: [
        "Land records verification",
        "Agricultural loans approval",
        "Scheme implementations",
        "Grievance redressal",
        "Policy information"
      ],
      timings: "Mon-Fri: 10:00 AM - 4:00 PM",
      distance: "12 km"
    },
    {
      name: "Horticulture Department - Kakinada",
      type: "Specialized Department",
      address: "Government Complex, Kakinada, Andhra Pradesh",
      phone: "08842-256789",
      services: [
        "Fruit crop guidance",
        "Vegetable farming support",
        "Nursery establishment",
        "Post-harvest technology",
        "Marketing assistance"
      ],
      timings: "Mon-Sat: 9:30 AM - 5:30 PM", 
      distance: "10 km"
    },
    {
      name: "Agricultural Market Committee - Kakinada",
      type: "Market Regulation Authority",
      address: "Market Yard, Kakinada, Andhra Pradesh",
      phone: "08842-267890",
      services: [
        "Market price monitoring",
        "Trading license issues",
        "Dispute resolution",
        "Quality standards",
        "Farmer registration"
      ],
      timings: "Mon-Sat: 8:00 AM - 6:00 PM",
      distance: "15 km"
    }
  ];

  const schemes = [
    {
      name: "PM-KISAN",
      description: "Direct income support to farmers",
      benefit: "₹6,000 per year",
      eligibility: "All landholding farmers"
    },
    {
      name: "Rythu Bandhu",
      description: "Investment support for agriculture",
      benefit: "₹10,000 per acre per year",
      eligibility: "Andhra Pradesh farmers"
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme",
      benefit: "Premium subsidy up to 90%",
      eligibility: "All farmers growing notified crops"
    },
    {
      name: "Kisan Credit Card",
      description: "Agricultural credit facility",
      benefit: "Easy credit access at 4% interest",
      eligibility: "Farmers with valid land documents"
    }
  ];

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
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">Government Organizations</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Government Agricultural Organizations
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect with local government offices and agricultural centers
          </p>
        </div>

        {/* Organizations Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6">Nearby Government Offices</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {organizations.map((org, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary">{org.name}</CardTitle>
                      <CardDescription className="text-base font-medium text-accent mt-1">
                        {org.type}
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {org.distance} away
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm mt-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{org.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="font-medium">{org.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <span>{org.timings}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-lg mb-3">Services Available</h4>
                  <div className="grid gap-2 mb-4">
                    {org.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Office
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Schemes Section */}
        <section>
          <h3 className="text-2xl font-bold text-primary mb-6">Government Schemes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {schemes.map((scheme, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-primary flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {scheme.name}
                  </CardTitle>
                  <CardDescription>{scheme.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Benefit</div>
                      <div className="font-semibold text-primary">{scheme.benefit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Eligibility</div>
                      <div className="text-sm">{scheme.eligibility}</div>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-primary hover:bg-primary-hover text-primary-foreground">
                    Learn More
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

export default Government;