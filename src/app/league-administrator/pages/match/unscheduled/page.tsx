"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorAlert, LoadingAlert } from "@/components/alerts"
import { useLeagueStaging } from "@/hooks/useLeagueStaging"
import { useLeagueCategories } from "@/hooks/useLeagueQueries"
import { MatchStagingType } from "@/models/match/match-types"
import TableWrapper from "./table-wrapper"
import UnscheduledMatchSheet from "./sheet-beta"

export default function MatchSchedulePage() {
    const { leagueStaging, leagueStagingLoading, leagueStagingError } = useLeagueStaging()
    const {
        leagueCategories,
        leagueCategoriesLoading,
        leagueCategoriesError,
        leagueMeta
    } = useLeagueCategories()


    const [activeTab, setActiveTab] = useState<string | undefined>(
        leagueCategories.length > 0 ? leagueCategories[0].category_id : undefined
    )

    const header = (
        <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                <h1 className="text-base font-medium">Unscheduled</h1>
            </div>
        </header>
    )

    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full">
                {header}

                <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                    <UnscheduledMatchSheet/>

                    {leagueStagingLoading || leagueCategoriesLoading ? (
                        <LoadingAlert
                            title="Loading Match Schedule"
                            description="Please wait while we fetch the data."
                        />
                    ) : null}

                    {leagueStagingError && (
                        <ErrorAlert errorMessage={`Failed to load staging data: ${leagueStagingError.message}`} />
                    )}

                    {leagueCategoriesError && (
                        <ErrorAlert errorMessage={`Failed to load categories: ${leagueCategoriesError.message}`} />
                    )}

                    {!leagueStagingLoading &&
                        !leagueCategoriesLoading &&
                        !leagueStagingError &&
                        !leagueCategoriesError &&
                        leagueCategories.length > 0 && (
                            <Tabs value={activeTab} defaultValue={leagueCategories[0].category_id} onValueChange={setActiveTab} className="w-full">
                                <TabsList>
                                    {leagueCategories.map((category) => (
                                        <TabsTrigger
                                            key={category.category_id}
                                            value={category.category_id}
                                            className="whitespace-nowrap"
                                        >
                                            {category.category_name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {leagueCategories.map((category) => {
                                    const data: MatchStagingType[] = leagueStaging.filter(
                                        (s) => s.division_id === category.category_id
                                    )

                                    return (
                                        <TabsContent
                                            key={category.category_id}
                                            value={category.category_id}
                                            className="mt-4"
                                        >

                                            {data.length > 0 ? (
                                                data.map((item) => (
                                                    <div className="flex flex-col" key={item.stage_id}>
                                                        <Separator className="mb-2" />
                                                        {leagueMeta?.has_league && (
                                                            <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-xs w-fit">
                                                                @league/{leagueMeta.league_meta?.league_title}/divisions/{category.category_name}/unscheduled/round/{item.category}
                                                            </code>
                                                        )}
                                                        <TableWrapper stage={item} />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-muted-foreground italic">No staging data for this category.</div>
                                            )}
                                        </TabsContent>
                                    )
                                })}
                            </Tabs>
                        )}
                </div>
            </div>
        </SidebarInset>
    )
}
