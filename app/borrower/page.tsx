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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="p-8 max-h-full h-full space-y-8 bg-gradient-to-r from-[#181127] via-purple-700 to-purple-900">
        <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold tracking-tight">Borrower Dashboard</h2>
      </div>

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
            <h3 className="text-lg font-medium">Recent Loans</h3>
            <p className="text-sm text-muted-foreground">Latest loan applications</p>
          </div>
          <RecentLoans />
        </Card>
      </div>
    </div>
  )
}