"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState,useEffect } from "react"
import { getDoc, getDocs,collection } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

// Mock data for loan requests
const loanRequests = [
  { id: 1, borrower: "John D.", amount: 5000, purpose: "Home Renovation" },
  { id: 2, borrower: "Sarah M.", amount: 10000, purpose: "Business Expansion" },
  { id: 3, borrower: "Mike R.", amount: 3000, purpose: "Education" },
]

export default function BrowseRequests() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [interestRate, setInterestRate] = useState("")
  const [duration, setDuration] = useState("")
  const [loanRequests, setLoanRequests] = useState<any[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const loanRequestsRef = collection(db, "loan_requests");
        const querySnapshot = await getDocs(loanRequestsRef);
        
        const data = querySnapshot.docs.flatMap((doc) => {
          const borrowerId = doc.id;
          const loans = doc.data().loan_requests || [];
          return loans.map((loan: any) => ({
            ...loan,
            borrowerId,
          }));
        });
  
        setLoanRequests(data); 
        console.log("Loan Requests:", data); 
      } catch (error) {
        console.error("Error fetching loan requests:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleSubmitOffer = () => {
    console.log({
      requestId: selectedRequest?.id,
      interestRate,
      duration,
    })
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#181127] via-purple-700 to-purple-900">
      <main className="flex-1 p-8">
        <div className="grid gap-6">
          <h1 className="text-2xl font-bold">Browse Loan Requests</h1>

          {loanRequests.map((request) => (
            <Card key={request.id} className="bg-[#605EA1] border-gray-500">
              <CardHeader>
                <CardTitle>Loan Request #{request.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Borrower</p>
                      <p>{request.borrowerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Amount</p>
                      <p>${request.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                      <p>{request.purpose}</p>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setSelectedRequest(request);
                          setInterestRate(""); // Reset form fields
                          setDuration("");
                        }}
                        className="w-full"
                      >
                        Make an Offer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Make a Loan Offer</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="interest">Interest Rate (%)</Label>
                          <Input
                            id="interest"
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            placeholder="Enter interest rate"
                            className="bg-[#353369] border-white"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="duration">Loan Duration (months)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="Enter loan duration"
                            className="bg-[#353369] border-white"
                          />
                        </div>
                        <Button onClick={handleSubmitOffer}>Submit Offer</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};