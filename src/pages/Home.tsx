import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sprout,
  Phone,
  Mail,
  Facebook,
  Twitter,
  MessageSquare,
  Menu,
  X,
  Globe
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "../assets/ai.jpg";

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t, i18n } = useTranslation();

  // Language change is handled by LanguageContext

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
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                {t('home')}
              </Link>
              <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">
                {t('features')}
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                {t('about')}
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                {t('contact')}
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button asChild variant="ghost" className="text-primary hover:text-primary-hover">
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground">
                <Link to="/signup">{t('signup')}</Link>
              </Button>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40 bg-background/50">
                  <Globe className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder={t('selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="bn">বাংলা</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="ur">اردو</SelectItem>
                  <SelectItem value="gu">ગુજરાતી</SelectItem>
                  <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                  <SelectItem value="or">ଓଡ଼ିଆ</SelectItem>
                  <SelectItem value="ml">മലയാളം</SelectItem>
                  <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                </SelectContent>
              </Select>
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
              <Link to="/" className="block text-foreground hover:text-primary transition-colors">
                {t('home')}
              </Link>
              <Link to="/features" className="block text-muted-foreground hover:text-primary transition-colors">
                {t('features')}
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                {t('about')}
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                {t('contact')}
              </Link>
              <div className="flex space-x-4 pt-4 border-t border-border/40">
                <Button asChild variant="ghost" className="text-primary hover:text-primary-hover">
                  <Link to="/login">{t('login')}</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  <Link to="/signup">{t('signup')}</Link>
                </Button>
              </div>
              <div className="pt-4 border-t border-border/40">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full bg-background/50">
                    <Globe className="h-4 w-4 mr-2 text-primary" />
                    <SelectValue placeholder={t('selectLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="bn">বাংলা</SelectItem>
                    <SelectItem value="te">తెలుగు</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                    <SelectItem value="ur">اردو</SelectItem>
                    <SelectItem value="gu">ગુજરાતી</SelectItem>
                    <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                    <SelectItem value="or">ଓଡ଼ିଆ</SelectItem>
                    <SelectItem value="ml">മലയാളം</SelectItem>
                    <SelectItem value="pa">ਪੰਜਾਬੀ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative container mx-auto px-4 text-center text-white">
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-white/90">
                {t('heroSubtitle')}
              </p>
            </div>

            <div className="pt-8">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Link to="/login">{t('getStarted')}</Link>
              </Button>
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
                <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-card-foreground">Legal</h3>
              <div className="space-y-2">
                <Link to="/privacy-policy" className="block text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms-of-service" className="block text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
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

export default Home;