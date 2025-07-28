"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MatchTeamType, MatchType } from "@/models/match/match-types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePersistentStartMatchStore } from "./store"

export default function MatchStartPage() {
    const { data } = usePersistentStartMatchStore()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const enterFullscreen = () => {
        const elem = containerRef.current
        if (!elem) return
        if (elem.requestFullscreen) {
            elem.requestFullscreen()
        } else if ((elem as any).webkitRequestFullscreen) {
            (elem as any).webkitRequestFullscreen()
        } else if ((elem as any).mozRequestFullScreen) {
            (elem as any).mozRequestFullScreen()
        } else if ((elem as any).msRequestFullscreen) {
            (elem as any).msRequestFullscreen()
        }
    }

    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        }
    }

    // Listen to fullscreen change
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)
        return () =>
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                exitFullscreen()
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <div ref={containerRef} className="w-full h-screen">
            {isFullscreen ? (
                <div className="grid place-items-center h-screen">
                    {data ? <FullscreenContent match={data} /> : "Please select a match to start."}
                </div>
            ) : (
                <div className="grid place-items-center h-screen">
                    <Button onClick={enterFullscreen}>Enter Fullscreen</Button>
                </div>
            )}
        </div>
    )
}




function FullscreenContent({ match }: { match: MatchType }) {
    const teamCard = (t: MatchTeamType) => (
        (
            <div className="flex items-center gap-3 justify-center">
                <Avatar className="h-10 w-10 rounded-sm overflow-hidde">
                    <AvatarImage src={t.team_logo_url} className="object-cover" />
                    <AvatarFallback>{t.team_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                    <p className="text-sm font-medium leading-none">{t.team_name}</p>
                    <p className="text-xs text-muted-foreground">#{t.league_team_id}</p>
                </div>
            </div>
        )
    )
    return (
        <div className="md:col-span-3 flex items-center gap-4">
            <div className="flex-[1.5] border border-dashed rounded-lg p-4 min-h-[120px] text-center bg-muted/40 flex flex-col items-center justify-center">
                <p className="font-semibold mb-2">Home Team</p>
                {match?.home_team ? (
                    teamCard(match.home_team)
                ) : (
                    <p className="text-muted-foreground text-sm">Not selected</p>
                )}
            </div>

            <div className="w-12 text-center font-bold text-lg text-muted-foreground">V.S.</div>

            <div className="flex-[1.5] border border-dashed rounded-lg p-4 min-h-[120px] text-center bg-muted/40 flex flex-col items-center justify-center">
                <p className="font-semibold mb-2">Away Team</p>
                {match?.away_team ? (
                    teamCard(match.away_team)
                ) : (
                    <p className="text-muted-foreground text-sm">Not selected</p>
                )}
            </div>
        </div>
    )
}