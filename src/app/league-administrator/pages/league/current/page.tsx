"use client"
import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function CurrentLeaguePage() {

    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full">
                <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
                    <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mx-2 data-[orientation=vertical]:h-4"
                        />
                        <h1 className="text-base font-medium">Create New League</h1>
                        <div className="ml-auto flex items-center gap-2">
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                </div>
            </div>
        </SidebarInset>
    );
}
