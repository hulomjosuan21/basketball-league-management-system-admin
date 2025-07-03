"use client"

import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import React from "react"
const JWT_SECRET = process.env.JWT_SECRET_KEY
export default function DashboardPage() {
    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full overflow-y-auto">

                <header className="sticky top-0 z-10 w-full bg-background flex h-10 shrink-0 items-center gap-2 py-2 px-4 border-b">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mx-2" />
                    <span className="font-semibold text-sm">Dashboard</span>
                </header>

                <div className="flex-1 flex flex-col gap-4 p-4">
                    <p>{JWT_SECRET as string}</p>
                </div>
            </div>
        </SidebarInset>
    )
}
