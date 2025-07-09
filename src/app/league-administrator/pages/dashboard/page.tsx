'use client'

import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useLeagueMeta } from "@/lib/stores/useLeagueMeta"
import { useQuery } from '@tanstack/react-query'
import { fetchLeagueMeta } from "@/services/league-service"
import { useEffect } from "react"
import { DashboardHero } from "./dashboard-hero"
import { useLeagueAdmin } from "@/hooks/useLeagueAdmin"
import { ErrorAlert, LoadingAlert, NoLeagueFoundAlert } from "@/components/alerts"

export default function DashboardPage() {
    const { data: admin, isLoading: isAdminLoading, error: adminError } = useLeagueAdmin()
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
        <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">Dashboard</h1>
                <div className="ml-auto flex items-center gap-2"></div>
            </div>
        </header>
    )

    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full overflow-x-hidden overflow-y-auto">
                {header}

                <div className="flex flex-col gap-4 p-4">
                    {isLoading && <LoadingAlert title={"Fetching League Meta..."} description={"Please wait while we load the league information."} />}

                    {error && <ErrorAlert errorMessage={`Failed to fetch league meta: ${error.message}`}/>}

                    {!leagueMeta && <NoLeagueFoundAlert/>}

                    {!isLoading && !error && admin && !isAdminLoading && !adminError && <DashboardHero admin={admin} />}

                    <section className="w-full">
                        <span className="font-simibold text-md text-center">Recent</span>
                    </section>
                </div>
            </div>
        </SidebarInset>
    )
}
