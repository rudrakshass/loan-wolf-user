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
    <div className="min-h-screen">
        <h1>lender page</h1>
    </div>
  )
}