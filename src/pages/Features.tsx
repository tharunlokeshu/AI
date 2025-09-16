import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Sprout,
  Leaf,
  Target,
  TrendingUp,
  Shield,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Menu,
  X,
  MessageSquare
} from "lucide-react";
import { useState } from "react";

const Features = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Navigation */}
      <nav className="bg-card/95 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">AgriPlus AI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/features" className="text-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button asChild variant="ghost" className="text-primary hover:text-primary-hover">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border/40 py-4 space-y-4">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/features" className="block text-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <div className="flex space-x-4 pt-4 border-t border-border/40">
                <Button asChild variant="ghost" className="text-primary hover:text-primary-hover">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Key Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Smart Farming Made Simple
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to make informed farming decisions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-8 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border/60 hover:border-accent/50">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-card-foreground">AI Crop Recommendation</h3>
                <p className="text-muted-foreground">Smart crop suggestions based on your soil, climate, and local conditions</p>
              </Card>

              <Card className="p-8 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border/60 hover:border-accent/50">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-card-foreground">Crop Plans & Schedules</h3>
                <p className="text-muted-foreground">Detailed planting, care, and harvesting schedules for maximum yield</p>
              </Card>

              <Card className="p-8 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border/60 hover:border-accent/50">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-card-foreground">Local Market & Vendor Details</h3>
                <p className="text-muted-foreground">Real-time market prices and trusted local vendor connections</p>
              </Card>

              <Card className="p-8 text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border/60 hover:border-accent/50">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-card-foreground">Government Schemes & Loans</h3>
                <p className="text-muted-foreground">Access to government schemes, subsidies, and agricultural loan programs</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 border-t border-border/40 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-accent/20 p-2 rounded-lg">
                  <Sprout className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-primary">AgriPlus</span>
              </div>
              <p className="text-muted-foreground">
                Empowering farmers with AI-driven insights for sustainable and profitable farming.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/features" className="block text-foreground hover:text-primary transition-colors">
                  Features
                </Link>
                <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">Legal</h3>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-accent/10 hover:bg-accent/20 p-3 rounded-lg transition-colors group"
                >
                  <Facebook className="h-5 w-5 text-primary group-hover:text-accent-foreground" />
                </a>
                <a
                  href="#"
                  className="bg-accent/10 hover:bg-accent/20 p-3 rounded-lg transition-colors group"
                >
                  <MessageSquare className="h-5 w-5 text-primary group-hover:text-accent-foreground" />
                </a>
                <a
                  href="#"
                  className="bg-accent/10 hover:bg-accent/20 p-3 rounded-lg transition-colors group"
                >
                  <Twitter className="h-5 w-5 text-primary group-hover:text-accent-foreground" />
                </a>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">support@agriplus.ai</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 AgriPlus. All rights reserved. Built with ❤️ for farmers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
