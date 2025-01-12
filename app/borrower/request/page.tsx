"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase/config"
import { arrayUnion, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, doc as firestoreDoc, addDoc, increment } from "firebase/firestore"
import { AlertCircle, CheckCircle } from "lucide-react"

interface Proposal {
  id: string;
  amount: number;
  borrowerId: string;
  borrowerName: string;
  created_at: string;
  duration: number;
  interestRate: number;
  lenderId: string;
  lenderName: string;
  purpose: string;
  requestId: string;
  status: string;
}

export default function RequestLoan() {
  const [amount, setAmount] = useState<number>(500)
  const [purpose, setPurpose] = useState("")
  const [borrowerName, setBorrowerName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [myProposals, setMyProposals] = useState<Proposal[]>([]);
  const [acceptedLoans, setAcceptedLoans] = useState<Proposal[]>([]);

  useEffect(() => {
    const fetchBorrowerName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'borrower', user.uid));
          const userData = userDoc.data();
          if (userData?.firstName) {
            setBorrowerName(userData.firstName);
          }
        } catch (error) {
          console.error("Error fetching borrower name:", error);
        }
      }
    };
    fetchBorrowerName();
  }, []);

  useEffect(() => {
    const fetchProposals = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const proposalsRef = collection(db, 'proposals');
        const q = query(
          proposalsRef,
          where('borrowerId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const proposals: Proposal[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Proposal));

        proposals.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setMyProposals(proposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, []);

  useEffect(() => {
    const fetchAcceptedLoans = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const proposalsRef = collection(db, 'proposals');
        const q = query(
          proposalsRef,
          where('borrowerId', '==', user.uid),
          where('status', '==', 'accepted')
        );
        
        const querySnapshot = await getDocs(q);
        const accepted = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Proposal[];

        setAcceptedLoans(accepted);
      } catch (error) {
        console.error("Error fetching accepted loans:", error);
      }
    };

    fetchAcceptedLoans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const borrowerId = auth.currentUser?.uid;
      if (!borrowerId || !borrowerName) {
        throw new Error("User information not available");
      }

      const loanDetails = {
        amount,
        purpose,
        borrowerId,
        borrowerName,
        created_at: new Date().toISOString(),
        status: "pending",
      };

      // First, create an individual loan request document
      const loanRequestRef = doc(db, "loan_requests", `${borrowerId}_${Date.now()}`);
      await setDoc(loanRequestRef, loanDetails);

      // Then, update the user's loan requests array
      const userLoanRequestsRef = doc(db, "borrower", borrowerId);
      await setDoc(
        userLoanRequestsRef,
        {
          loan_requests: arrayUnion(loanDetails),
        },
        { merge: true }
      );

      alert("Loan request submitted successfully!");
      setAmount(1000);
      setPurpose("");
    } catch (error) {
      console.error("Error submitting loan request:", error);
      alert(error instanceof Error ? error.message : "Failed to submit loan request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptProposal = async (proposal: Proposal) => {
    try {
      const proposalRef = firestoreDoc(db, 'proposals', proposal.id);
      
      // Update proposal status to accepted
      await updateDoc(proposalRef, {
        status: 'accepted',
        accepted_at: new Date().toISOString()
      });

      // Create an active loan document
      const loanData = {
        ...proposal,
        status: 'active',
        created_at: new Date().toISOString(),
        proposal_id: proposal.id,
        next_payment_date: calculateNextPaymentDate(),
        monthly_payment: calculateEMI(proposal.amount, proposal.interestRate, proposal.duration),
        remaining_payments: proposal.duration
      };

      await addDoc(collection(db, 'active_loans'), loanData);

      // Refresh proposals list
      const updatedProposals = myProposals.map(p => 
        p.id === proposal.id ? { ...p, status: 'accepted' } : p
      );
      setMyProposals(updatedProposals);

      alert('Loan offer accepted successfully!');
    } catch (error) {
      console.error('Error accepting proposal:', error);
      alert('Failed to accept loan offer. Please try again.');
    }
  };

  const handlePayment = async (proposal: Proposal) => {
    try {
      const emi = Number(calculateEMI(proposal.amount, proposal.interestRate, proposal.duration));
      
      // Update the loan document
      const loanRef = firestoreDoc(db, 'proposals', proposal.id);
      await updateDoc(loanRef, {
        remaining_payments: increment(-1),
        total_paid: increment(emi),
        last_payment_date: new Date().toISOString(),
        next_payment_date: calculateNextPaymentDate(),
        status: proposal.remaining_payments <= 1 ? 'completed' : 'active'
      });

      // Create payment record
      await addDoc(collection(db, 'payments'), {
        loan_id: proposal.id,
        borrower_id: auth.currentUser?.uid,
        lender_id: proposal.lenderId,
        amount: emi,
        payment_date: new Date().toISOString(),
        payment_number: proposal.duration - proposal.remaining_payments + 1
      });

      // Refresh proposals list
      const updatedProposals = myProposals.map(p => 
        p.id === proposal.id 
          ? { 
              ...p, 
              remaining_payments: p.remaining_payments - 1,
              status: p.remaining_payments <= 1 ? 'completed' : 'active'
            } 
          : p
      );
      setMyProposals(updatedProposals);

      alert('Payment successful!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  const calculateNextPaymentDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString();
  };

  const calculateTotalPayable = (loans: Proposal[]) => {
    return loans.reduce((total, loan) => {
      const emi = Number(calculateEMI(loan.amount, loan.interestRate, loan.duration));
      const totalPayable = emi * loan.duration;
      return total + totalPayable;
    }, 0);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#181127] via-purple-700 to-purple-900 px-14">
      <main className="flex-1 items-center py-8">
        <h2 className="text-5xl font-bold tracking-tight">Requests</h2>
        <br />
        
        {/* Add this new section at the top */}
        {acceptedLoans.length > 0 && (
          <Card className="bg-[#605EA1] max-w-7xl mb-6">
            <CardHeader>
              <CardTitle>Loan Summary</CardTitle>
              <CardDescription>Overview of your accepted loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Active Loans</p>
                  <p className="text-2xl font-bold">{acceptedLoans.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Principal</p>
                  <p className="text-2xl font-bold">
                    ₹{acceptedLoans.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Payable Amount</p>
                  <p className="text-2xl font-bold text-green-500">
                    ₹{calculateTotalPayable(acceptedLoans).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Interest Rate</p>
                  <p className="text-2xl font-bold">
                    {(acceptedLoans.reduce((sum, loan) => sum + loan.interestRate, 0) / acceptedLoans.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-[#605EA1] max-w-7xl">
          <CardHeader>
            <CardTitle>Request a Loan</CardTitle>
            <CardDescription>
              Specify your loan amount and purpose to receive offers from lenders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 ">
              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Amount: ₹{amount}</label>
                <Slider
                  value={[amount]}
                  onValueChange={(value) => setAmount(value[0])}
                  max={10000}
                  min={1000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹1,000</span>
                  <span>₹10,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Purpose</label>
                <Input
                  placeholder="Briefly describe why you need this loan"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="bg-[#353369]"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Loan Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <br />
        <Card className="max-w-7xl bg-[#605EA1]"> 
          <CardHeader>
            <CardTitle>Loan Offers Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProposals.map((proposal) => (
                <Card key={proposal.requestId} className="p-4 bg-[#353369] border-gray-500">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {proposal.status === "proposed" ? (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <p className="font-medium text-lg">₹{proposal.amount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">From: {proposal.lenderName}</p>
                        <p className="text-sm text-muted-foreground">Interest Rate: {proposal.interestRate}%</p>
                        <p className="text-sm text-muted-foreground">Duration: {proposal.duration} months</p>
                        <p className="text-sm text-muted-foreground">EMI: ₹{calculateEMI(proposal.amount, proposal.interestRate, proposal.duration)}/month</p>
                        <p className="text-xs text-muted-foreground">
                          Received: {new Date(proposal.created_at).toLocaleDateString()}
                        </p>
                        {proposal.status === 'accepted' && (
                          <>
                            <p className="text-sm text-muted-foreground">
                              Remaining Payments: {proposal.remaining_payments || proposal.duration}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Next Payment: {new Date(proposal.next_payment_date || calculateNextPaymentDate()).toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {proposal.status === "proposed" ? (
                        <Button 
                          variant="default"
                          onClick={() => handleAcceptProposal(proposal)}
                        >
                          Accept Offer
                        </Button>
                      ) : proposal.status === "accepted" && proposal.remaining_payments > 0 ? (
                        <Button 
                          variant="default"
                          onClick={() => handlePayment(proposal)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Pay EMI ₹{calculateEMI(proposal.amount, proposal.interestRate, proposal.duration)}
                        </Button>
                      ) : (
                        <span className="px-2 py-1 text-sm bg-green-500/20 text-green-500 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {myProposals.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No loan offers received yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

// Add this helper function at the bottom
function calculateEMI(principal: number, interestRate: number, duration: number): string {
  const monthlyRate = (interestRate / 12) / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, duration)) / 
              (Math.pow(1 + monthlyRate, duration) - 1);
  return emi.toFixed(2);
}