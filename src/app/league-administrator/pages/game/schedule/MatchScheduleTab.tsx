"use client"
import { TabsContent } from "@/components/ui/tabs"
import MatchSchedulerSection from "./MatchSchedulerSection"
import { MatchTeamTable } from "./table"

type MatchScheduleTab = {
    value: string
}

export default function MatchScheduleTab({value}:MatchScheduleTab){
    return (
        <TabsContent value={value}>
            <MatchSchedulerSection/>
            <MatchTeamTable category_id=""/>
        </TabsContent>
    )
}