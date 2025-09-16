import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sprout, 
  Calendar, 
  MapPin, 
  Building2, 
  CreditCard, 
  Camera,
  User,
  LogOut 
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const services = [
    {
      title: "Crop Advisory",
      description: "Get AI-powered crop recommendations based on your farm conditions",
      icon: Sprout,
      link: "/crop-advisory",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Crop Plan",
      description: "Create detailed farming plans with step-by-step guidance",
      icon: Calendar,
      link: "/crop-plan",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Local Market & Vendor Details",
      description: "Find nearby mandis and vendors with current prices",
      icon: MapPin,
      link: "/local-market",
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      title: "Government Organizations",
      description: "Connect with Rythu Bharosa Kendras and agricultural offices",
      icon: Building2,
      link: "/government",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Bank Loan Schemes",
      description: "Explore agricultural loan schemes and financing options",
      icon: CreditCard,
      link: "/bank-loans",
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      title: "Crop Disease Detection",
      description: "Upload crop images to detect diseases and get treatment advice",
      icon: Camera,
      link: "/disease-detection",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">Smart Crop Advisory</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.name}</span>
            </div>
            <Button 
              onClick={() => {
                logout();
                navigate("/");
              }} 
              variant="outline" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Welcome to Your Farm Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive agricultural services to optimize your farming operations
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className={`${service.bg} w-fit p-3 rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-primary group-hover:text-primary-hover transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Link to={service.link}>
                    Access Service
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;