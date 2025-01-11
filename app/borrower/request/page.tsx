"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { auth, db } from "@/lib/firebase/config"
import { arrayUnion, doc, setDoc } from "firebase/firestore"

export default function RequestLoan() {
  const [amount, setAmount] = useState<number>(500)
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
    <div className="flex min-h-screen">
      <main className="flex-1 items-center p-8">
        <Card>
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
                  max={20000}
                  min={1000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹1,000</span>
                  <span>₹20,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Purpose</label>
                <Input
                  placeholder="Briefly describe why you need this loan"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Loan Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}