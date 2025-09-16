import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Sprout } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">AgriPlus AI</h1>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-primary mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p className="text-lg">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                Welcome to AgriPlus AI. These Terms of Service ("Terms") govern your use of our agricultural advisory platform and services. By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">2. Description of Service</h2>
              <p>
                AgriPlus AI provides AI-powered agricultural advisory services including:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Crop recommendation and planning</li>
                <li>Disease detection and treatment advice</li>
                <li>Market price information</li>
                <li>Government scheme information</li>
                <li>Bank loan scheme details</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">3. User Accounts</h2>
              <h3 className="text-xl font-medium text-card-foreground mb-2">Account Creation</h3>
              <p className="mb-4">
                To use certain features of our service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>

              <h3 className="text-xl font-medium text-card-foreground mb-2">Account Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Keep your password secure</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Use the service only for lawful purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">4. Acceptable Use Policy</h2>
              <p>You agree not to use the service to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit harmful or malicious code</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Interfere with the proper functioning of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">5. Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are owned by AgriPlus AI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">6. Disclaimer of Warranties</h2>
              <p>
                The information provided through our service is for general informational purposes only. While we strive for accuracy, we cannot guarantee the completeness, reliability, or suitability of the information. Agricultural decisions should be made with professional consultation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">7. Limitation of Liability</h2>
              <p>
                In no event shall AgriPlus AI be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">8. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the service immediately, without prior notice, for any reason, including breach of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any changes by posting the new Terms on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p><strong>Email:</strong> legal@agriplus.ai</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> AgriPlus AI, Tech Park, Hyderabad, India</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
