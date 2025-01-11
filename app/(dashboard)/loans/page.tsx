"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Mock data for demonstration
const loanRequests = [
  { id: 1, amount: 5000, borrower: "John Doe", credit_score: 720 },
  { id: 2, amount: 10000, borrower: "Jane Smith", credit_score: 680 },
  { id: 3, amount: 15000, borrower: "Mike Johnson", credit_score: 750 },
]

const loanOffers = [
  { id: 1, amount: 5000, lender: "ABC Bank", interest_rate: 8.5, duration: 12 },
  { id: 2, amount: 5000, lender: "XYZ Finance", interest_rate: 9.0, duration: 24 },
  { id: 3, amount: 5000, lender: "Best Loans", interest_rate: 7.5, duration: 36 },
]

export default function LoansPage() {
  const [amount, setAmount] = useState(5000)
  const [sortBy, setSortBy] = useState("interest_rate")
  const { toast } = useToast()

  const handleLoanRequest = () => {
    toast({
      title: "Loan Request Submitted",
      description: `Your loan request for $${amount} has been submitted successfully.`,
    })
  }

  const handleLendOffer = () => {
    toast({
      title: "Offer Submitted",
      description: "Your lending offer has been submitted successfully.",
    })
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Loan Center</h1>

        {/* Borrower Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Request a Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label>Loan Amount: ${amount}</Label>
                <Slider
                  value={[amount]}
                  onValueChange={(value) => setAmount(value[0])}
                  max={50000}
                  step={1000}
                  className="mt-2"
                />
              </div>
              <Button onClick={handleLoanRequest}>Submit Loan Request</Button>
            </div>
          </CardContent>
        </Card>

        {/* Loan Offers Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Loan Offers</CardTitle>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="interest_rate">Interest Rate</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {loanOffers.map((offer) => (
                <Card key={offer.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{offer.lender}</h3>
                        <p className="text-sm text-gray-500">
                          ${offer.amount} for {offer.duration} months
                        </p>
                        <p className="text-sm text-gray-500">
                          Interest Rate: {offer.interest_rate}%
                        </p>
                      </div>
                      <Button>Accept Offer</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lender Section */}
        <Card>
          <CardHeader>
            <CardTitle>Available Loan Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {loanRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{request.borrower}</h3>
                        <p className="text-sm text-gray-500">
                          Requesting: ${request.amount}
                        </p>
                        <p className="text-sm text-gray-500">
                          Credit Score: {request.credit_score}
                        </p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Lend</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Make a Lending Offer</DialogTitle>
                            <DialogDescription>
                              Set your terms for lending ${request.amount} to {request.borrower}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Interest Rate (%)</Label>
                              <Input type="number" step="0.1" min="0" max="100" />
                            </div>
                            <div className="space-y-2">
                              <Label>Duration (months)</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="12">12 months</SelectItem>
                                  <SelectItem value="24">24 months</SelectItem>
                                  <SelectItem value="36">36 months</SelectItem>
                                  <SelectItem value="48">48 months</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleLendOffer} className="w-full">
                              Submit Offer
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}