import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Percent, Clock, FileText, Phone } from "lucide-react";

const BankLoans = () => {
  const loanSchemes = [
    {
      bank: "State Bank of India",
      schemeName: "SBI Kisan Credit Card",
      purpose: "Crop production & maintenance",
      loanAmount: "₹50,000 - ₹3,00,000",
      interestRate: "7% - 9%",
      tenure: "1 year (renewable)",
      processing: "Minimal documentation",
      features: [
        "No collateral for loans up to ₹1.6 lakh",
        "Flexible repayment options",
        "Insurance coverage available",
        "ATM cum Debit Card facility"
      ],
      contact: "1800-425-3800",
      branch: "Kakinada Main Branch"
    },
    {
      bank: "HDFC Bank",
      schemeName: "Agri Term Loan", 
      purpose: "Farm equipment & infrastructure",
      loanAmount: "₹2,00,000 - ₹50,00,000",
      interestRate: "8.5% - 11%",
      tenure: "3 - 7 years",
      processing: "Quick approval in 7-10 days",
      features: [
        "Covers tractors, harvesters, irrigation systems",
        "Step-up/step-down repayment options",
        "Moratorium period available",
        "Part prepayment without penalty"
      ],
      contact: "1800-267-4332",
      branch: "HDFC Bank Kakinada"
    },
    {
      bank: "ICICI Bank",
      schemeName: "Crop Loan",
      purpose: "Seasonal agricultural activities",
      loanAmount: "₹25,000 - ₹10,00,000",
      interestRate: "7.5% - 10%",
      tenure: "12 months",
      processing: "Same day approval*",
      features: [
        "Covers seeds, fertilizers, pesticides",
        "Hassle-free documentation",
        "Digital banking facilities",
        "Competitive interest rates"
      ],
      contact: "1860-120-7777",
      branch: "ICICI Bank Kakinada Circle"
    },
    {
      bank: "Andhra Pradesh Grameena Vikas Bank",
      schemeName: "Rythu Mitra Loan",
      purpose: "Comprehensive farm development",
      loanAmount: "₹1,00,000 - ₹25,00,000",
      interestRate: "6.5% - 8.5%",
      tenure: "1 - 5 years",
      processing: "Regional bank - faster processing",
      features: [
        "Special rates for small farmers",
        "Government subsidy benefits",
        "Local language support",
        "Doorstep banking services"
      ],
      contact: "08852-242424",
      branch: "APGVB Kakinada Main"
    }
  ];

  const requirements = [
    {
      title: "Basic Documents",
      items: [
        "Aadhaar Card & PAN Card",
        "Land ownership documents",
        "Bank statements (6 months)",
        "Income certificate"
      ]
    },
    {
      title: "Agricultural Documents",
      items: [
        "Land revenue records",
        "Crop cultivation certificate",
        "Soil health card",
        "Previous loan clearance certificate"
      ]
    },
    {
      title: "Financial Documents",
      items: [
        "ITR for last 2 years",
        "Agricultural income proof",
        "Asset valuation certificate",
        "Guarantor documents (if required)"
      ]
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
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">Bank Loan Schemes</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Agricultural Loan Schemes
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore financing options for your farming needs
          </p>
        </div>

        {/* Loan Schemes */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6">Available Loan Schemes</h3>
          <div className="space-y-6">
            {loanSchemes.map((loan, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-primary">{loan.bank}</CardTitle>
                      <CardDescription className="text-lg font-semibold text-accent">
                        {loan.schemeName}
                      </CardDescription>
                      <p className="text-muted-foreground mt-2">{loan.purpose}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Processing</div>
                      <div className="font-medium text-primary">{loan.processing}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Loan Details */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-secondary/30 p-4 rounded-lg text-center">
                      <CreditCard className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-lg font-bold text-primary">{loan.loanAmount}</div>
                      <div className="text-sm text-muted-foreground">Loan Amount</div>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-lg text-center">
                      <Percent className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-lg font-bold text-primary">{loan.interestRate}</div>
                      <div className="text-sm text-muted-foreground">Interest Rate</div>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-lg text-center">
                      <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-lg font-bold text-primary">{loan.tenure}</div>
                      <div className="text-sm text-muted-foreground">Tenure</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Key Features</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {loan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Contact & Branch</div>
                      <div className="font-medium">{loan.branch}</div>
                      <div className="text-primary font-medium">{loan.contact}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Bank
                      </Button>
                      <Button variant="outline">
                        Apply Online
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Requirements Section */}
        <section>
          <h3 className="text-2xl font-bold text-primary mb-6">Document Requirements</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {requirements.map((req, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-primary flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {req.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {req.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BankLoans;