import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";

interface LoanScheme {
  scheme: string;
  loanAmount: string;
  interestRate: string;
  apply: string;
  description: string;
  source: string;
}

interface BankLoansData {
  schemes: LoanScheme[];
}

const BankLoans = () => {
  const { userInputData, selectedCrop } = useAuth();
  const { data, loading, error, callApi } = useApi<BankLoansData>();

  useEffect(() => {
    if (userInputData && selectedCrop) {
      callApi('http://localhost:5002/api/bank-loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: userInputData.location,
          crop: selectedCrop,
          landSize: userInputData.landSize,
          landType: userInputData.landType,
        }),
      });
    }
  }, [userInputData, selectedCrop]);

  // Added for testing: log data when received
  useEffect(() => {
    if (data) {
      console.log('Bank loan schemes data:', data);
    }
  }, [data]);

  if (loading) return <div>Loading bank loan schemes...</div>;
  if (error) return <div>Error loading bank loan schemes: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Location: {userInputData?.location}</h2>
        <h2 className="text-lg font-semibold">Land Size: {userInputData?.landSize} acres</h2>
        <h2 className="text-lg font-semibold">Land Type: {userInputData?.landType}</h2>
      </div>

      <h1 className="text-2xl font-bold mb-4">🔎 Local Bank / RRB / State-Bank Interest Rate Info</h1>

      {data && data.schemes && data.schemes.length > 0 ? (
        <Table className="mb-8">
          <TableHeader>
            <TableRow>
              <TableHead>Bank / Scheme</TableHead>
              <TableHead>What they offer in your region</TableHead>
              <TableHead>Interest Rate(s) & Conditions</TableHead>
              <TableHead>How this applies to your land</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.schemes.map((scheme, idx) => (
              <TableRow key={idx}>
                <TableCell>{scheme.scheme}</TableCell>
                <TableCell>{scheme.description}</TableCell>
                <TableCell>{scheme.interestRate}</TableCell>
                <TableCell>Applicable for {userInputData?.landSize} acres of {userInputData?.landType} land; {scheme.loanAmount} available.</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No bank loan schemes found for the selected crop and location.</p>
      )}

      <h2 className="text-xl font-bold mb-4">⚙️ What This Means for You (based on your land details)</h2>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Short-term crop loans:</strong> Options like Kisan Credit Card from Andhra Pradesh Grameena Bank are ideal for immediate needs such as seeds and fertilizers for your 2-acre irrigated paddy land, with low interest rates of 4-7%.</li>
        <li><strong>Term loans for irrigation, equipment, infrastructure:</strong> Schemes like Agriculture Infrastructure Fund from NABARD provide long-term financing up to ₹10 lakh for upgrading irrigation on your land, with interest rates of 7-9% and terms up to 10 years.</li>
        <li><strong>Government subsidies:</strong> KCC offers credit support; AIF includes interest subvention up to 3%; PM-KISAN provides ₹6,000 annual income support for your landholding.</li>
        <li><strong>Risks:</strong> Late repayment may incur penalties of 2-3% additional interest; collateral required for loans above ₹1 lakh; ensure timely application to avoid delays.</li>
      </ul>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <button
          onClick={async () => {
            try {
              const response = await fetch('http://localhost:5002/api/bank-loans?format=pdf', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  location: userInputData.location,
                  crop: selectedCrop,
                  landSize: userInputData.landSize,
                  landType: userInputData.landType,
                }),
              });
              if (!response.ok) throw new Error('Failed to download PDF');
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `bank_loans_report_${userInputData.location.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error('Error downloading PDF:', error);
              alert('Failed to download PDF. Please try again.');
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default BankLoans;
