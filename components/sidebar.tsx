"use client"

import { Home, DollarSign, Users, History, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

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

  return (
    <div className="space-y-4 py-4 px-2 flex flex-col h-full bg-[#181127] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Loan<span className="text-primary ">Wolf</span>
        </h1>
        </Link>
        <div className="space-y-1">
          {defaultRoutes.map((route) => (
            <motion.div
              key={route.href}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              <Link
                href="/lender"
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            </motion.div>
          ))}
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
              )}
            >
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
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  )
}