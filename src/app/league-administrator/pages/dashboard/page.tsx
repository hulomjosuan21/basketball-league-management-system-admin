"use client"
import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useHandleErrorWithToast } from "@/lib/utils/handleError"
export default function DashboardPage() {
    const handleError = useHandleErrorWithToast();
    const handleClick = () => {
        try {
            throw new Error("Yesy")
        }catch(e) {
            handleError(e)
        }
    }

    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full overflow-y-auto">
                <header className="flex h-(--header-height) py-1 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
                    <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mx-2 data-[orientation=vertical]:h-4"
                        />
                        <h1 className="text-base font-medium">Dashboard</h1>
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                                <Link
                                    href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    className="dark:text-foreground"
                                >
                                    GitHub
                                </Link>
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col gap-4 p-4">
                    <Button className="w-fit" onClick={handleClick}>Test Error</Button>
                </div>
            </div>
        </SidebarInset>
    )
}