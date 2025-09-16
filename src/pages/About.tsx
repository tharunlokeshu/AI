import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sprout,
  Users,
  Target,
  Shield,
  Phone,
  Mail,
  Facebook,
  Twitter,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import farmerPortrait from "../assets/farmer-portrait.jpg";

const About = () => {
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
              <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
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
              <Link to="/features" className="block text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/about" className="block text-foreground hover:text-primary transition-colors">
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

      {/* About Section */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">
                  About AgriPlus
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our mission is simple: helping farmers make better decisions using AI technology.
                  We combine traditional farming wisdom with modern artificial intelligence to provide
                  personalized guidance that increases crop yields and farmer prosperity.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-lg flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Farmer-First Approach</h3>
                    <p className="text-muted-foreground">Built by farmers, for farmers - understanding real field challenges</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-lg flex-shrink-0">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Data-Driven Insights</h3>
                    <p className="text-muted-foreground">AI-powered recommendations based on local climate, soil, and market data</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-lg flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Complete Support</h3>
                    <p className="text-muted-foreground">From planning to harvest, with access to schemes and financial support</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={farmerPortrait}
                  alt="Happy farmer with fresh crops"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-2">10,000+</h3>
                <p className="text-sm font-medium">Happy Farmers</p>
              </div>
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
                <Link to="/features" className="block text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
                <Link to="/about" className="block text-foreground hover:text-primary transition-colors">
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

export default About;
