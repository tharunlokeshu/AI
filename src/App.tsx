import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserInput from "./pages/UserInput";
import Dashboard from "./pages/Dashboard";
import CropAdvisory from "./pages/CropAdvisory";
import CropPlan from "./pages/CropPlan";
import LocalMarket from "./pages/LocalMarket";
import Government from "./pages/Government";
import BankLoans from "./pages/BankLoans";
import DiseaseDetection from "./pages/DiseaseDetection";
import NotFound from "./pages/NotFound";
import TestTranslation from "./components/TestTranslation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/user-input" element={<UserInput />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/crop-advisory" element={<CropAdvisory />} />
              <Route path="/crop-plan" element={<CropPlan />} />
              <Route path="/local-market" element={<LocalMarket />} />
              <Route path="/government" element={<Government />} />
              <Route path="/bank-loans" element={<BankLoans />} />
              <Route path="/disease-detection" element={<DiseaseDetection />} />
              <Route path="/test-translation" element={<TestTranslation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
