"use client"
import { TabsContent } from "@/components/ui/tabs"
import { useLeagueMeta } from "@/lib/stores/useLeagueMeta"
import { UnscheduledMatchTable } from "./table"
import { useMatch } from "@/hooks/userMatchQueries"
import { MatchStatus } from "@/models/match/match-types"

type Props = {
    value: string
}

export default function MatchScheduleTab({value}:Props){

    return (
        <TabsContent value={value}>
            <UnscheduledMatchTable value={value}/>
        </TabsContent>
    )
}