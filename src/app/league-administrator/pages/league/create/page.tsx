"use client"
import {
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CircleAlert, CircleQuestionMark } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateLeagueForm from "./create-league-form"
import { InformationDisplay, InformationDisplayProps } from "@/components/InformationDisplay"
import rawJson from "@/data/jsons/creating-league-info.json" assert { type: "json" };
import { useLeagueMeta } from "@/lib/stores/useLeagueMeta"

export const defaultInformation = rawJson as InformationDisplayProps;

export default function CreateLeaguePage() {
    const [showInstructions, setShowInstructions] = useState(false)
    const { leagueMeta } = useLeagueMeta()

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

                    {leagueMeta.has_league && (
                        <Alert variant="default">
                            <CircleAlert className="h-4 w-4 text-blue-500" />
                            <AlertTitle>Action Not Allowed</AlertTitle>
                            <AlertDescription>
                                You cannot create a new league until the current league is finished.
                            </AlertDescription>
                        </Alert>
                    )}

                    <CreateLeagueForm hasLeague={leagueMeta.has_league} />
                </div>
            </div>
        </SidebarInset>
    );
}
