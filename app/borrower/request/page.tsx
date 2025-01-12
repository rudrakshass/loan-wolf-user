"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { auth, db } from "@/lib/firebase/config"
import { arrayUnion, doc, setDoc } from "firebase/firestore"
import { AlertCircle, CheckCircle } from "lucide-react"


const tickets = [
  {
    id: "T-1234",
    subject: "Loan Application Status",
    status: "Open",
    updated: "10 days left"
  },
  {
    id: "T-1235",
    subject: "Payment Confirmation",
    status: "Closed",
    updated: "Closed 2 days ago",
  },
  {
    id: "T-1235",
    subject: "Payment Confirmation",
    status: "Closed",
    updated: "Closed 2 days ago",
  }
];

export default function RequestLoan() {
  const [amount, setAmount] = useState<number>(1000)
  const [purpose, setPurpose] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const loanDetails = {
        amount: amount,
        purpose,
        borrowerId: auth.currentUser?.uid || "unknown", 
        created_at: new Date().toISOString(), 
        status: "pending",
      };
      console.log("Submitting loan request:", auth.currentUser?.uid);
      const borrowerId = auth.currentUser?.uid;
    if (!borrowerId) {
      throw new Error("User is not authenticated.");
    }

      const loanDocRef = doc(db, "loan_requests", borrowerId);
      await setDoc(
        loanDocRef,
        {
          loan_requests: arrayUnion(loanDetails),
        },
        { merge: true }
      );
      console.log("Loan request submitted successfully:", loanDetails);  
      alert("Loan request submitted successfully!");
      setAmount(500);
      setPurpose("")
    } catch (error) {
      console.error("Error submitting loan request:", error);
      alert("Failed to submit loan request. Please try again later.");
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#181127] via-purple-700 to-purple-900 px-14">
      <main className="flex-1 items-center py-8">
        <h2 className="text-5xl font-bold tracking-tight">Requests</h2>
        <br />
        <Card className="bg-[#050e1a] border-gray-500 max-w-7xl">
          <CardHeader>
            <CardTitle>Request a Loan</CardTitle>
            <CardDescription>
              Specify your loan amount and purpose to receive offers from lenders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Amount: ₹{amount}</label>
                <Slider
                  value={[amount]}
                  onValueChange={(value) => setAmount(value[0])}
                  max={20000}
                  min={1000}
                  step={100}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹1,000</span>
                  <span>₹20,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Purpose</label>
                <Textarea
                  placeholder="Briefly describe why you need this loan"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="bg-[#081c36]"
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Loan Request
              </Button>
            </form>
          </CardContent>
        </Card>
        <br />
        <Card className="max-w-7xl bg-[#050e1a] border-gray-500"> 
        <CardHeader>
          <CardTitle>Your Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {ticket.status === "Open" ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">Lender's Name: Ramu Ji</p>
                    <p className="text-sm text-muted-foreground">Request ID: {ticket.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{ticket.status}</p>
                  <p className="text-sm text-muted-foreground">{ticket.updated}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </main>
    </div>
  )
}