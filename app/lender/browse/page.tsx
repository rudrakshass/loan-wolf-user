"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

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

  const handleSubmitOffer = () => {
    console.log({
      requestId: selectedRequest?.id,
      interestRate,
      duration,
    })
    // Handle offer submission
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar userType="lender" className="w-64 border-r" />
      <main className="flex-1 p-8">
        <div className="grid gap-6">
          <h1 className="text-2xl font-bold">Browse Loan Requests</h1>
          
          {loanRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle>Loan Request #{request.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Borrower</p>
                      <p>{request.borrower}</p>
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
                        onClick={() => setSelectedRequest(request)}
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
  )
}