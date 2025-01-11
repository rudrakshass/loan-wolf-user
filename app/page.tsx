import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, DollarSign, Shield, Clock, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }}></div>
        </div>

        <div className="relative">
          <nav className="border-b border-white/10">
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-500 bg-clip-text text-transparent">
                  Loan<span className="text-primary">Wolf</span>
                </h1>
                <div className="space-x-4">
                  <Link href="/login">
                    <Button variant="ghost" className="text-purple-500 hover:text-purple-400 hover:bg-white/10">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-white text-gray-900 hover:bg-gradient-to-r from-white to-purple-400 ">Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <div className="container mx-auto px-6 py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h2 className="text-6xl font-bold leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Redefining <br />
                  Peer-to-Peer <br />
                  Lending
                </h2>
                <p className="text-xl text-gray-400 max-w-lg">
                  Join the future of lending. Connect directly with verified borrowers and lenders on our secure platform.
                </p>
                <div className="flex gap-4">
                  <Link href="/borrower">
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200 text-lg px-8">
                      Start Borrowing
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/lender">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-8">
                      Start Lending
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl rounded-full"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Current Rate</p>
                        <p className="text-2xl font-bold text-white">8.5%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Avg. Return</p>
                        <p className="text-2xl font-bold text-white">12.3%</p>
                      </div>
                    </div>
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Loans</span>
                        <span className="text-white">$24.8M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Active Lenders</span>
                        <span className="text-white">2,847</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Success Rate</span>
                        <span className="text-white">98.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="container mx-auto px-6 py-24">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur transition group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-white/10">
                  <DollarSign className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Smart Rates</h3>
                  <p className="text-gray-400">AI-powered rate matching system for optimal lending outcomes.</p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur transition group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-white/10">
                  <Shield className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Bank-Grade Security</h3>
                  <p className="text-gray-400">Enterprise-level encryption and identity verification systems.</p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-lg blur transition group-hover:opacity-100 group-hover:duration-200"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-white/10">
                  <Clock className="w-12 h-12 text-pink-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Instant Matching</h3>
                  <p className="text-gray-400">Get matched with the right lender in minutes, not days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}