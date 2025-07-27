"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLeagueCategories } from "@/hooks/useLeagueQueries"
import React from "react"
import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GenerateOptions, MatchStagingType } from "@/models/match/match-types"
import { useLeagueStaging } from "@/hooks/useLeagueStaging"
import { LeagueCategories } from "@/models/league"
import { ErrorAlert, LoadingAlert } from "@/components/alerts"
import { useMatchStageSheet } from "./store"
import { MatchStagingOptionsSheet } from "./form"

export default function MatchStagingOptionsPage() {
    const { leagueStaging, leagueStagingLoading, leagueStagingError } = useLeagueStaging()
    const {
        leagueCategories,
        leagueCategoriesLoading,
        leagueCategoriesError,
        leagueMeta
    } = useLeagueCategories()

    const header = (
        <header className="sticky top-0 z-10 bg-background border-b flex items-center gap-2 py-1">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                <h1 className="text-base font-medium">Staging Options</h1>
            </div>
        </header>
    )

    return (
        <SidebarInset>
            <div className="flex flex-col h-screen w-full">
                {header}

                <div className="flex-1 p-4 flex flex-col gap-4">
                    <MatchStagingOptionsSheet />
                    {leagueStagingLoading || leagueCategoriesLoading ? (
                        <LoadingAlert
                            title="Loading Match Staging Options"
                            description="Please wait while we fetch the data."
                        />
                    ) : null}

                    {leagueStagingError && (
                        <ErrorAlert errorMessage={`Failed to load staging data: ${leagueStagingError.message}`} />
                    )}

                    {leagueCategoriesError && (
                        <ErrorAlert errorMessage={`Failed to load categories: ${leagueCategoriesError.message}`} />
                    )}

                    {(!leagueStagingLoading && !leagueCategoriesLoading && !leagueStagingError && !leagueCategoriesError && leagueMeta) && (
                        <div className="flex flex-col gap-4">
                            {leagueCategories.map((c) => {
                                const category_id = c.category_id;
                                const matchStagingFromCategory = leagueStaging.filter(
                                    (staging) => staging.division_id === category_id
                                )

                                return (
                                    <div className="flex flex-col gap-2" key={c.category_id}>
                                        {leagueMeta?.has_league && (
                                            <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-xs">
                                                @league/{leagueMeta.league_meta?.league_title}/divisions/{c.category_name}/staging
                                            </code>
                                        )}
                                        <ConnectedRectangles
                                            league_id={leagueMeta.league_meta?.league_id}
                                            matchStaging={matchStagingFromCategory}
                                            division={c}
                                        />
                                        <Separator />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </SidebarInset>
    )
}

type ConnectedRectanglesProps = {
    league_id?: string;
    division: LeagueCategories,
    matchStaging: MatchStagingType[]
}

export function ConnectedRectangles({
    league_id,
    division,
    matchStaging,
}: ConnectedRectanglesProps) {
    const { openSheet } = useMatchStageSheet()
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-4">
                {matchStaging.length === 0 ? (
                    <div onClick={() => openSheet({ league_id: league_id, division_id: division.category_id })} className="flex items-center justify-center px-6 py-4 border rounded-md w-fit whitespace-nowrap text-sm min-h-[80px]">
                        <span className="text-muted-foreground">Empty</span>
                    </div>
                ) : (
                    matchStaging.map((staging, index) => (
                        <React.Fragment key={staging.stage_id}>
                            <div className="flex items-center justify-center px-6 py-4 border rounded-md w-fit whitespace-nowrap text-sm min-h-[80px]">
                                <span className="font-medium">{staging.category}</span>
                            </div>

                            {index < matchStaging.length - 1 && (
                                <div className="w-6 h-px bg-muted" />
                            )}
                        </React.Fragment>
                    ))
                )}

                {
                    matchStaging.length > 0 && <Button size="icon" onClick={() => openSheet({ league_id: league_id, division_id: division.category_id })}>
                        <MoveRight />
                    </Button>
                }

            </div>
        </div>
    );
}
