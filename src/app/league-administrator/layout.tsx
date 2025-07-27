import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "BogoBallers | League Admin",
  description: "Your app dashboard with all essential controls.",
}

export default function RootLayoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />

        {/* Content area, scrollable */}
        <main className="flex-1 h-full w-full overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
