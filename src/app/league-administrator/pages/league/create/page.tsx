"use client"
import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { CircleQuestionMark } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateLeagueForm from "./create-league-form"
import { InformationDisplay, InformationDisplayProps } from "@/components/InformationDisplay"
import rawJson from "@/data/jsons/creating-league-info.json" assert { type: "json" };
import { useLeagueMeta } from "@/lib/stores/useLeagueMeta"
import { ErrorAlert, InfoAlert } from "@/components/alerts"
import { useLeagueAdmin } from "@/hooks/useLeagueAdmin";

export const defaultInformation = rawJson as InformationDisplayProps;

export default function CreateLeaguePage() {
    const [showInstructions, setShowInstructions] = useState(false)
    const { leagueMeta } = useLeagueMeta()
    const {data: admin, isLoading, error} = useLeagueAdmin()

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
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-7"
                                onClick={() => setShowInstructions(prev => !prev)}
                            >
                                <CircleQuestionMark />
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {showInstructions && <>
                        <InformationDisplay {...defaultInformation} />
                        <Separator />
                    </>
                    }

                    {!leagueMeta.has_league && (
                        <InfoAlert title="Action Not Allowed" description="You cannot create a new league until the current league is finished."/>
                    )}

                    {error && <ErrorAlert errorMessage={`Error: ${error.message}`} />}

                    {admin && !isLoading && !error && <CreateLeagueForm hasLeague={!leagueMeta.has_league} />}
                </div>
            </div>
        </SidebarInset>
    );
}
