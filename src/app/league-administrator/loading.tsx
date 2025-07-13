// app/league-administrator/loading.tsx
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 flex items-center justify-center h-screen">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading page...</span>
        </div>
      </div>
    </SidebarProvider>
  )
}
