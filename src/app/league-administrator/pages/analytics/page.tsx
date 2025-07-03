import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import React from "react"

export default function AnalyticsPage() {
    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full overflow-y-auto">

                <header className="sticky top-0 z-10 w-full bg-background flex h-10 shrink-0 items-center gap-2 py-2 px-4 border-b">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mx-2" />
                    <span className="font-semibold text-sm">Analytics</span>
                </header>

                <div className="flex-1 flex flex-col gap-4 p-4">

                </div>
            </div>
        </SidebarInset>
    )
}