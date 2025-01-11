"use client"

import { Home, DollarSign, Users, History, Settings, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import wolfimage from "@/components/assets/wolf.png";
import { auth } from "@/lib/firebase/config"
import { signOut } from "firebase/auth"

const defaultRoutes = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/',
    color: "text-sky-500"
  },
];

export function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <div className="space-y-4 space-x-20 py-4 px-2 flex flex-col h-full bg-[#181127] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex flex-col items-center mb-14">
          <div className="flex flex-col items-center">
            <img src={wolfimage.src} alt="Wolf Logo" className="h-11 w-11 mb-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Loan<span className="text-primary">Wolf</span>
            </h1>
          </div>
        </Link>
        <div className="space-y-1">
          {children}
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <Link
              href="/profile"
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === "/profile" ? "text-white bg-white/10" : "text-zinc-400",
              )}>
              <div className="flex items-center flex-1">
                <Users className="h-5 w-5 mr-3 text-pink-700" />
                Profile
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
      <div className="px-3 py-2">
        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          <Button 
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  )
}