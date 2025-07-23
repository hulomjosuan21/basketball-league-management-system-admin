"use client"

import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLeagueCategories } from "@/hooks/useLeagueQueries"

export default function MatchScheduledPage() {
    const { leagueCategories, leagueMeta } = useLeagueCategories()
    const [activeTab, setActiveTab] = useState("")

    useEffect(() => {
        if (leagueCategories.length > 0 && !activeTab) {
            setActiveTab(leagueCategories[0].category_id)
        }
    }, [leagueCategories, activeTab])

    const header = (
        <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                <h1 className="text-base font-medium">Schedules</h1>
            </div>
        </header>
    )

    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full">
                {header}

                <div className="flex-1 p-4 flex flex-col gap-4">
                    {(leagueMeta && leagueMeta.has_league) && <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-xs">
                        @league/{leagueMeta.league_meta?.league_title}/divisions/team/schedules
                    </code>}
                    {activeTab && (
                        <Tabs
                            key={'sheduled-team-tab'}
                            defaultValue={activeTab}
                            value={activeTab}
                            onValueChange={(val) => setActiveTab(val)}
                            className="w-full"
                        >
                            <TabsList>
                                {leagueCategories.map((category) => (
                                    <TabsTrigger
                                        key={category.category_id}
                                        value={category.category_id}
                                    >
                                        {category.category_name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <Separator />
                            <TabsContent value={activeTab}>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>
        </SidebarInset>
    )
}
