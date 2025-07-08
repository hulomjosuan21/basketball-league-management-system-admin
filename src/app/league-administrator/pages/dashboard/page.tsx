"use client"
import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LeagueMeta, useLeagueMeta } from "@/lib/stores/useLeagueMeta"
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { fetchLeagueMeta } from "@/services/league-service"
import { useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2Icon } from "lucide-react"
import { SectionCards } from "./section-cards"

export default function DashboardPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['league-meta'],
        queryFn: fetchLeagueMeta,
        staleTime: 5 * 60_000,
    })

    const { leagueMeta, setLeagueMeta } = useLeagueMeta()

    useEffect(() => {
        if (data) {
            setLeagueMeta(data)
        }
    }, [data, setLeagueMeta])

    const header = (
        <header className="flex h-(--header-height) py-1 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">Dashboard</h1>
                <div className="ml-auto flex items-center gap-2">

                </div>
            </div>
        </header>
    )

    const contentHasLeague = () => {
        if (leagueMeta.league_meta && leagueMeta.has_league && !isLoading && !error) {
            return <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6">
                    <SectionCards />
                </div>
            </div>
        } else {
            return null
        }
    }

    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full overflow-y-auto">
                {header}

                <div className="flex flex-col gap-4 p-4">
                    {isLoading && (
                        <Alert>
                            {isLoading && <Loader2Icon className="animate-spin" />}
                            <AlertTitle>Fetching League Meta...</AlertTitle>
                            <AlertDescription>
                                Please wait while we load the league information.
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Failed to fetch league meta: {error.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    {contentHasLeague()}
                </div>
            </div>
        </SidebarInset>
    )
}