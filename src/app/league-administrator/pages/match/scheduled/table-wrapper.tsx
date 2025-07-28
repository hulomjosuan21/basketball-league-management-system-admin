import { useMatchTeams } from "@/hooks/useMatchTeam";
import { MatchStagingType, MatchStatus, MatchType } from "@/models/match/match-types";
import { useEffect, useState } from "react";
import { ScheduledMatchTable } from "./table";

type Props = {
    stage: MatchStagingType;
}

export default function TableWrapper({ stage }: Props) {
    const { matchTeams, matchTeamsLoading, matchTeamsError } = useMatchTeams({ stage_id: stage.stage_id, category_id: stage.division_id, status: MatchStatus.SCHEDULED });

    return (
        <div>
            {
                !matchTeamsError && (
                    <ScheduledMatchTable data={matchTeams} isLoading={matchTeamsLoading} stage={{stage_id: stage.stage_id, division_id: stage.division_id}}/>
                )
            }
        </div>
    )
}