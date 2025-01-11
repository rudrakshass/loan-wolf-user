'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar } from '@/components/sidebar';
import { DollarSign, History, LayoutDashboardIcon, PhoneCallIcon } from "lucide-react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div>
      <div className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen">
            <Sidebar>
            <motion.div 
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              <Link
                href="/lender"
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition"
                )}
              >
                <div className="flex items-center flex-1">
                  <LayoutDashboardIcon className={cn("h-5 w-5 mr-3")} />
                  Dashboard
                </div>
              </Link>
            </motion.div>
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <Link
                  href="/lender/browse"
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  )}
                >
                  <div className="flex items-center flex-1">
                    <DollarSign className="h-5 w-5 mr-3 text-violet-500" />
                    Lend
                  </div>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <Link
                  href="/lender/history"
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  )}
                >
                  <div className="flex items-center flex-1">
                    <History className="h-5 w-5 mr-3 text-orange-700" />
                    History
                  </div>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <Link
                  href="/lender/helpdesk"
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  )}
                >
                  <div className="flex items-center flex-1">
                    <PhoneCallIcon className="h-5 w-5 mr-3 text-gray-500" />
                    Helpdesk
                  </div>
                </Link>
              </motion.div>
            </Sidebar>
            <div className="flex-1 overflow-y-auto bg-background">
              {children}
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </div>
    </div>
  );
}