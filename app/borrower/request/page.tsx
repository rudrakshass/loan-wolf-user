"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function RequestLoan() {
  const [amount, setAmount] = useState<number>(5000)
  const [purpose, setPurpose] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle loan request submission
    console.log({ amount, purpose })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar userType="borrower" className="w-64 border-r" />
      <main className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Request a Loan</CardTitle>
            <CardDescription>
              Specify your loan amount and purpose to receive offers from lenders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Loan Amount: ${amount}</label>
                <Slider
                  value={[amount]}
                  onValueChange={(value) => setAmount(value[0])}
                  max={50000}
                  min={1000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$1,000</span>
                  <span>$50,000</span>
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