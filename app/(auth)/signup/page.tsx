"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function SignUp() {
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState(searchParams.get("type") || "borrower")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Account created!",
      description: "Welcome to LoanWolf. Please verify your email to continue.",
    })
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}></div>
      </div>
      
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="absolute top-6 left-6">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Loan<span className="text-primary">Wolf</span>
          </Link>
        </div>
        
        <Card className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Create Account</CardTitle>
            <CardDescription className="text-gray-400">Join LoanWolf to start your journey</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">I want to</Label>
                <RadioGroup
                  defaultValue={userType}
                  onValueChange={setUserType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="borrower" id="borrower" />
                    <Label htmlFor="borrower" className="text-gray-300">Borrow</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lender" id="lender" />
                    <Label htmlFor="lender" className="text-gray-300">Lend</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your full name" 
                  required 
                  className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Create a password" 
                  required 
                  className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              {userType === "borrower" && (
                <div className="space-y-2">
                  <Label htmlFor="id-proof" className="text-gray-300">ID Proof</Label>
                  <div className="relative">
                    <Input 
                      id="id-proof" 
                      type="file" 
                      accept="image/*,.pdf" 
                      required 
                      className="bg-gray-800/50 border-white/10 text-white file:bg-white/10 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-white/20"
                    />
                  </div>
                  <p className="text-sm text-gray-500">Upload a valid government ID (passport, driver's license, etc.)</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-white text-gray-900 hover:bg-gray-200">
                Create Account
              </Button>
              <div className="text-sm text-center text-gray-400">
                Already have an account?{" "}
                <Link href="/signin" className="text-white hover:text-gray-300 underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}