"use client"

import { ActivityChart } from "@/components/activity-chart";
import { RecentLoans } from "@/components/recent-loans copy";
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import {
  Users,
  Banknote,
  ArrowUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Smile,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ProtectedRoute from '@/components/protected-route'
import { motion } from 'framer-motion';

interface Proposal {
  id: string;
  amount: number;
  borrowerName: string;
  purpose: string;
  interestRate: number;
  duration: number;
  status: string;
  created_at: string;
  total_paid?: number;
  remaining_payments?: number;
  last_payment_date?: string;
}

interface LoanRequest {
  id: string;
  [key: string]: any;
}

export default function BrowseRequests() {
  const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(null);
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const [username, setUsername] = useState(""); // Changed to include setUsername
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [proposalDetails, setProposalDetails] = useState<LoanRequest | null>(null);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [pendingProposals, setPendingProposals] = useState<Proposal[]>([]);
  const [acceptedLoans, setAcceptedLoans] = useState<Proposal[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'lender', user.uid));
          const userData = userDoc.data();
          setUsername(userData?.firstName || "Guest");
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUsername("Guest");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "loan_requests"));
        const requests: LoanRequest[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by date to show most recent first
        requests.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        setLoanRequests(requests);
      } catch (error) {
        console.error("Error fetching loan requests:", error);
      }
    };

    fetchLoanRequests();
  }, []);

  useEffect(() => {
    const fetchPendingProposals = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'proposals'),
          where('lenderId', '==', user.uid),
          where('status', '==', 'proposed')
        );
        
        const querySnapshot = await getDocs(q);
        const proposals = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Proposal[];

        proposals.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setPendingProposals(proposals);
      } catch (error) {
        console.error("Error fetching pending proposals:", error);
      }
    };

    fetchPendingProposals();
  }, []);

  useEffect(() => {
    const fetchAcceptedLoans = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'proposals'),
          where('lenderId', '==', user.uid),
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

  const handleAcceptRequest = async (request: LoanRequest) => {
    setProposalDetails(request);
    setIsDialogOpen(true);
  };

  const handleSubmitProposal = async () => {
    try {
      const lenderId = auth.currentUser?.uid;
      if (!lenderId) {
        throw new Error("Lender not authenticated");
      }

      const lenderDoc = await getDoc(doc(db, 'lender', lenderId));
      const lenderData = lenderDoc.data();
      const lenderName = lenderData?.firstName || "Unknown Lender";

      const proposalData = {
        lenderId,
        lenderName,
        borrowerId: proposalDetails?.borrowerId,
        borrowerName: proposalDetails?.borrowerName,
        amount: proposalDetails?.amount,
        purpose: proposalDetails?.purpose,
        interestRate: Number(interestRate),
        duration: Number(duration),
        status: "proposed",
        created_at: new Date().toISOString(),
        requestId: proposalDetails?.id
      };

      await addDoc(collection(db, 'proposals'), proposalData);
      
      setIsDialogOpen(false);
      setInterestRate("");
      setDuration("");
      setProposalDetails(null);
      alert("Proposal submitted successfully!");
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Failed to submit proposal. Please try again.");
    }
  };

  const calculateTotalReturn = (loans: Proposal[]) => {
    return loans.reduce((total, loan) => {
      const monthlyInterest = (loan.amount * loan.interestRate) / (12 * 100);
      const totalAmount = loan.amount + (monthlyInterest * loan.duration);
      return total + totalAmount;
    }, 0);
  };

  const calculateTotalOutstanding = (loan: Proposal) => {
    const totalAmount = calculateTotalReturn([loan]);
    const paidAmount = loan.total_paid || 0;
    return totalAmount - paidAmount;
  };

  const handlePayment = () => {
    setShowQRCode(true);
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setShowQRCode(false);
      setIsPaymentProcessing(false);
      setIsPaymentSuccessful(true);
    }, 15000); // 15 seconds
  };

  const handlePaymentDialogOpenChange = (isOpen: boolean) => {
    setIsPaymentDialogOpen(isOpen);
    if (!isOpen) {
      setShowQRCode(false);
      setIsPaymentProcessing(false);
      setIsPaymentSuccessful(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-8 space-y-8 h-vh bg-gradient-to-r from-[#181127] via-purple-700 to-purple-900">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-200">Hello, {username}! 👋</h1>
          <p className="text-gray-400 mt-1">Welcome back to your lending dashboard</p>
        </div>
        
        <div className="flex justify-between items-center">
          <h2 className="text-5xl font-bold tracking-tight">Lender Dashboard</h2>
        </div>

        {/* Add this new section at the top */}
        {acceptedLoans.length > 0 && (
          <Card className="bg-[#605EA1] border-gray-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
          <CardTitle>Active Loans Summary</CardTitle>
          <CardDescription>Overview of your lending portfolio</CardDescription>
              </div>
              <Button
          onClick={() => setIsPaymentDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700"
              >
          Make a Payment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Active Loans</p>
            <p className="text-2xl font-bold">{acceptedLoans.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount Lent</p>
            <p className="text-2xl font-bold">
              ₹{acceptedLoans.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expected Returns</p>
            <p className="text-2xl font-bold text-green-500">
              ₹{calculateTotalReturn(acceptedLoans).toLocaleString()}
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

        {/* Add this new section for accepted loans with payment status */}
        <Card className="bg-[#605EA1] border-gray-500">
          <CardHeader>
            <CardTitle>Active Loans & Payments</CardTitle>
            <CardDescription>Track your active loans and received payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {acceptedLoans.map((loan) => (
                <Card key={loan.id} className="p-4 bg-[#353369] border-gray-500">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {loan.remaining_payments === 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        <p className="font-medium text-lg">₹{loan.amount.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Borrower: {loan.borrowerName}</p>
                        <p className="text-sm text-muted-foreground">Interest Rate: {loan.interestRate}%</p>
                        <p className="text-sm text-muted-foreground">Duration: {loan.duration} months</p>
                        <p className="text-sm text-muted-foreground">
                          Remaining Payments: {loan.remaining_payments || loan.duration}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Outstanding Amount: ₹{calculateTotalOutstanding(loan).toLocaleString()}
                        </p>
                        {loan.last_payment_date && (
                          <p className="text-xs text-muted-foreground">
                            Last Payment: {new Date(loan.last_payment_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {loan.remaining_payments === 0 ? (
                        <span className="px-3 py-1 text-sm bg-green-500/20 text-green-500 rounded-full">
                          Fully Paid
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-500 rounded-full">
                          {loan.remaining_payments} payments left
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {acceptedLoans.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No active loans at the moment
                </p>
              )}
            </div>
          </CardContent>
        </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 bg-[#605EA1] border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Limit</p>
              <h3 className="text-2xl font-bold mt-2">2,500</h3>
            </div>
            <div className="p-4 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-500">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>grant 2 more loans to unlock next limit.</span>
          </div>
        </Card>

        <Card className="p-6 bg-[#605EA1] border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Loans</p>
              <h3 className="text-2xl font-bold mt-2">4</h3>
            </div>
            <div className="p-4 bg-primary/10 rounded-full">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-red-500">
            <ArrowDownRight className="h-4 w-4 mr-1" />
            <span>4% from last month</span>
          </div>
        </Card>

        <Card className="p-6 bg-[#605EA1] border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Closed Loans</p>
              <h3 className="text-2xl font-bold mt-2">5</h3>
            </div>
            <div className="p-4 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-500">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>18% from last month</span>
          </div>
        </Card>

        <Card className="p-6 bg-[#605EA1] border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Loans Granted</p>
              <h3 className="text-2xl font-bold mt-2">9</h3>
            </div>
            <div className="p-4 bg-primary/10 rounded-full">
              <Smile className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-500">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>8% from last month</span>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 bg-[#605EA1] border-gray-500">
          <div className="p-6">
            <h3 className="text-lg font-medium">Platform Activity</h3>
            <p className="text-sm text-muted-foreground">Daily platform activity over time</p>
          </div>
          <ActivityChart />
        </Card>

        <Card className="col-span-3 bg-[#605EA1] border-gray-500">
          <div className="p-6">
            <h3 className="text-lg font-medium">Recent Loans</h3>
            <p className="text-sm text-muted-foreground">Latest loan applications</p>
          </div>
          <RecentLoans />
        </Card>
      </div>

      {/* Add this new section */}
      <Card className="bg-[#605EA1] border-gray-500">
        <CardHeader>
          <CardTitle>Your Pending Proposals</CardTitle>
          <CardDescription>Proposals you've made that are awaiting borrower response</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingProposals.map((proposal) => (
              <Card key={proposal.id} className="p-4 bg-[#353369] border-gray-500">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-lg font-medium">₹{proposal.amount?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      To: {proposal.borrowerName}
                    </p>
                    <p className="text-sm text-muted-foreground">Purpose: {proposal.purpose}</p>
                    <div className="flex gap-4">
                      <p className="text-sm text-muted-foreground">Interest: {proposal.interestRate}%</p>
                      <p className="text-sm text-muted-foreground">Duration: {proposal.duration} months</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Proposed: {new Date(proposal.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-sm bg-yellow-500/20 text-yellow-500 rounded-full">
                      Pending
                    </span>
                  </div>
                </div>
              </Card>
            ))}
            {pendingProposals.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No pending proposals
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#605EA1] border-gray-500">
        <CardHeader>
          <CardTitle>Available Loan Requests</CardTitle>
          <CardDescription>Browse and respond to loan requests from borrowers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loanRequests.map((request) => (
              <Card key={request.id} className="p-4 bg-[#353369] border-gray-500">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-lg font-medium">₹{request.amount?.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Requested by: {request.borrowerName}
                    </p>
                    <p className="text-sm text-muted-foreground">Purpose: {request.purpose}</p>
                    <p className="text-xs text-muted-foreground">
                      Posted: {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    
                  </div>
                </div>
              </Card>
            ))}
            {loanRequests.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No loan requests available at the moment
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#605EA1]">
          <DialogHeader>
            <DialogTitle>Submit Loan Proposal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Interest Rate (%)</Label>
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="Enter interest rate"
                className="bg-[#353369]"
              />
            </div>
            <div>
              <Label>Duration (months)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter loan duration"
                className="bg-[#353369]"
              />
            </div>
            <Button onClick={handleSubmitProposal} className="w-full">
              Submit Proposal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isPaymentDialogOpen} onOpenChange={handlePaymentDialogOpenChange}>
        <DialogContent className="bg-[#605EA1]">
          <DialogHeader>
            <DialogTitle>Payment Processing</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={handlePayment}>Proceed to Payment</Button>
          </div>

          {showQRCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center mt-4"
            >
              <img src="https://media.istockphoto.com/id/1347277582/vector/qr-code-sample-for-smartphone-scanning-on-white-background.jpg?s=2048x2048&w=is&k=20&c=dJraErXxUlsrT87lmNi-8mN9y-1ya1RPR3IoTLFcuzw=" alt="Fake QR Code" className="w-32 h-32" />
              <p className="ml-2">Scan the QR code to complete the payment</p>
            </motion.div>
          )}

          {isPaymentProcessing && !showQRCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center mt-4"
            >
              <div className="loader"></div>
              <p className="ml-2">Processing Payment...</p>
            </motion.div>
          )}

          {isPaymentSuccessful && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center mt-4"
            >
              <CheckCircle className="h-6 w-6 text-green-500" />
              <p className="ml-2">Payment Successful!</p>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  )
}