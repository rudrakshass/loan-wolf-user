"use client"

import { ActivityChart } from "@/components/activity-chart";
import { RecentLoans } from "@/components/recent-loans copy";
import {
  Users,
  Banknote,
  ArrowUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  Smile,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useEffect } from "react"
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import ProtectedRoute from '@/components/protected-route';

// Mock data for loan requests
const loanRequests = [
  { id: 1, borrower: "John D.", amount: 5000, purpose: "Home Renovation" },
  { id: 2, borrower: "Sarah M.", amount: 10000, purpose: "Business Expansion" },
  { id: 3, borrower: "Mike R.", amount: 3000, purpose: "Education" },
]

interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  duration: number;
  remaining_payments?: number;
  next_payment_date?: string;
  total_paid?: number;
  status: string;
}

export default function BorrowerDashboard() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [interestRate, setInterestRate] = useState("")
  const [duration, setDuration] = useState("")
  const [username, setUsername] = useState("") // Add this line
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'borrower', user.uid));
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

  // Add this new useEffect for fetching borrower's loan requests
  useEffect(() => {
    const fetchMyRequests = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'loan_requests'),
          where('borrowerId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMyRequests(requests);
      } catch (error) {
        console.error("Error fetching loan requests:", error);
      }
    };

    fetchMyRequests();
  }, []);

  // Add this new useEffect to fetch active loans
  useEffect(() => {
    const fetchActiveLoans = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'proposals'),
          where('borrowerId', '==', user.uid),
          where('status', 'in', ['accepted', 'active'])
        );
        
        const querySnapshot = await getDocs(q);
        const loans = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Loan[];

        setActiveLoans(loans);
      } catch (error) {
        console.error("Error fetching active loans:", error);
      }
    };

    fetchActiveLoans();
  }, []);

  const calculateNextPayment = (loan: Loan) => {
    const monthlyRate = (loan.interestRate / 12) / 100;
    const emi = (loan.amount * monthlyRate * Math.pow(1 + monthlyRate, loan.duration)) / 
                (Math.pow(1 + monthlyRate, loan.duration) - 1);
    return emi;
  };

  const calculateTotalDue = () => {
    return activeLoans.reduce((total, loan) => {
      const emi = calculateNextPayment(loan);
      return total + (emi * (loan.remaining_payments || loan.duration));
    }, 0);
  };

  const getNextPaymentDate = () => {
    const nextDates = activeLoans
      .map(loan => loan.next_payment_date)
      .filter(date => date)
      .sort();
    return nextDates[0] ? new Date(nextDates[0]).toLocaleDateString() : 'No upcoming payments';
  };

  const handleSubmitOffer = () => {
    console.log({
      requestId: selectedRequest?.id,
      interestRate,
      duration,
    })
    // Handle offer submission
  }

  return (
    <ProtectedRoute>
      <div className="p-8 space-y-8 h-vh bg-gradient-to-r from-[#181127] via-purple-700 to-purple-900">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-200">Hello, {username}! 👋</h1>
          <p className="text-gray-400 mt-1">Welcome back to your borrowing dashboard</p>
        </div>

        {/* Add Payment Summary Section */}
       

        <div className="flex justify-between items-center">
          <h2 className="text-5xl font-bold tracking-tight">Borrower Dashboard</h2>
        </div>
         {activeLoans.length > 0 && (
          <Card className="bg-[#605EA1] border-gray-500">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Overview of your loan payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Active Loans</p>
                  <p className="text-2xl font-bold">{activeLoans.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Payment Date</p>
                  <p className="text-2xl font-bold">{getNextPaymentDate()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next EMI Due</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    ₹{activeLoans.reduce((total, loan) => total + calculateNextPayment(loan), 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Outstanding</p>
                  <p className="text-2xl font-bold text-red-500">
                    ₹{calculateTotalDue().toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
              <span>fullfill 2 more loans to unlock next limit.</span>
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
                <p className="text-sm font-medium text-muted-foreground">Total Loans Taken</p>
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
              <h3 className="text-lg font-medium">Your Loan Requests</h3>
              <div className="space-y-4 mt-4">
                {myRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">₹{request.amount}</p>
                      <p className="text-sm text-muted-foreground">Purpose: {request.purpose}</p>
                      <p className="text-sm text-muted-foreground">Status: {request.status}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}