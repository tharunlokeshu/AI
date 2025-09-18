import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";

interface LoanScheme {
  scheme: string;
  loanAmount: string;
  interestRate: string;
  apply: string;
}

interface BankLoansData {
  schemes: LoanScheme[];
}

const BankLoans = () => {
  const { userInputData, selectedCrop } = useAuth();
  const { data, loading, error, callApi } = useApi<BankLoansData>();

  useEffect(() => {
    if (userInputData && selectedCrop) {
      callApi('/api/bank-loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: userInputData.location,
          crop: selectedCrop,
        }),
      });
    }
  }, [userInputData, selectedCrop]);

  if (loading) return <div>Loading bank loan schemes...</div>;
  if (error) return <div>Error loading bank loan schemes: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <h1 className="text-2xl font-bold mb-4">Bank Loan Schemes for {selectedCrop}</h1>
      {data && data.schemes && data.schemes.length > 0 ? (
        data.schemes.map((scheme, idx) => (
          <Card key={idx} className="mb-4">
            <CardHeader>
              <CardTitle>{scheme.scheme}</CardTitle>
              <CardDescription>Loan Amount: {scheme.loanAmount}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Interest Rate: {scheme.interestRate}</p>
              <p>Apply: {scheme.apply}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No bank loan schemes found for the selected crop and location.</p>
      )}
    </div>
  );
};

export default BankLoans;
