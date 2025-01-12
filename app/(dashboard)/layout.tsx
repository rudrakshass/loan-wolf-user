import { Sidebar } from "@/components/sidebar"
import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
        <Sidebar>{/* Pass an empty fragment as children */}</Sidebar>
      </div>
      <main className="md:pl-72">
        {children}
      </main>
    </div>
  )
}