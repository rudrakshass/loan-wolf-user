"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { getDoc, getDocs, collection, addDoc, doc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase/config"

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "loan_requests"));
        const requests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLoanRequests(requests);
      } catch (error) {
        console.error("Error fetching loan requests:", error);
      }
    };

    fetchLoanRequests();
  }, []);

  const handleSubmitOffer = async () => {
    try {
      const lenderId = auth.currentUser?.uid;
      if (!lenderId) {
        alert("Please login first");
        return;
      }

      const lenderDoc = await getDoc(doc(db, 'lender', lenderId));
      const lenderData = lenderDoc.data();
      const lenderName = lenderData?.firstName || "Unknown Lender";

      const proposalData = {
        lenderId,
        lenderName,
        borrowerId: selectedRequest.borrowerId,
        borrowerName: selectedRequest.borrowerName,
        amount: selectedRequest.amount,
        purpose: selectedRequest.purpose,
        interestRate: Number(interestRate),
        duration: Number(duration),
        status: "proposed",
        created_at: new Date().toISOString(),
        requestId: selectedRequest.id
      };

      await addDoc(collection(db, 'proposals'), proposalData);
      
      setIsDialogOpen(false);
      setInterestRate("");
      setDuration("");
      setSelectedRequest(null);
      alert("Proposal submitted successfully!");
    } catch (error) {
      console.error("Error submitting proposal:", error);
      alert("Failed to submit proposal. Please try again.");
    }
  };

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

                  <Button
                    onClick={() => {
                      setSelectedRequest(request);
                      setIsDialogOpen(true);
                    }}
                    className="w-full"
                  >
                    Make an Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#605EA1]">
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
  );
}