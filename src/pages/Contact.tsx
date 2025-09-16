import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  Sprout,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  MessageSquare,
  Menu,
  X,
  Send
} from "lucide-react";
import { useState } from "react";

const Contact = () => {
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
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
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
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="block text-foreground hover:text-primary transition-colors">
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

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Get in Touch
              </h2>
              <p className="text-lg text-muted-foreground">
                Have questions? We're here to help you grow smarter
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8 bg-card border-border/60">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-semibold">Send us a message</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <Input placeholder="Your name" className="bg-background border-border" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <Input type="email" placeholder="your.email@example.com" className="bg-background border-border" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                      <Textarea
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        className="bg-background border-border resize-none"
                      />
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <Card className="p-6 bg-card border-border/60">
                  <div className="flex items-center space-x-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Helpline</h3>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                      <p className="text-sm text-muted-foreground">24/7 Support Available</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border/60">
                  <div className="flex items-center space-x-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <p className="text-muted-foreground">support@agriplus.ai</p>
                      <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border/60">
                  <div className="flex items-center space-x-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Location</h3>
                      <p className="text-muted-foreground">Hyderabad, Telangana</p>
                      <p className="text-sm text-muted-foreground">Serving farmers across India</p>
                    </div>
                  </div>
                </Card>

                {/* Social Media */}
                <div className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-accent/10 hover:bg-accent/20 p-3 rounded-lg transition-colors group"
                    >
                      <Facebook className="h-6 w-6 text-primary group-hover:text-accent-foreground" />
                    </a>
                    <a
                      href="#"
                      className="bg-accent/10 hover:bg-accent/20 p-3 rounded-lg transition-colors group"
                    >
                      <MessageSquare className="h-6 w-6 text-primary group-hover:text-accent-foreground" />
                    </a>
                    <a
                      href="#"
                      className="bg-accent/10 hover:bg-accent/20 p-3 rounded-lg transition-colors group"
                    >
                      <Twitter className="h-6 w-6 text-primary group-hover:text-accent-foreground" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div> {/* closes max-w-4xl */}
        </div>   {/* closes container */}
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

export default Contact;
