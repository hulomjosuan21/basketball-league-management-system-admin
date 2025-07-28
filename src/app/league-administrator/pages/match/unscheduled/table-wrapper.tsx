import { useMatchTeams } from "@/hooks/useMatchTeam";
import { MatchStagingType, MatchType } from "@/models/match/match-types";
import { useEffect, useState } from "react";
import { UnscheduledMatchTable } from "./table";

type Props = {
    stage: MatchStagingType;
}

export default function TableWrapper({ stage }: Props) {
    const { matchTeams, matchTeamsLoading, matchTeamsError } = useMatchTeams({ stage_id: stage.stage_id, category_id: stage.division_id });

    return (
        <>
            {
                !matchTeamsError && (
                    <UnscheduledMatchTable data={matchTeams} isLoading={matchTeamsLoading} stage={{stage_id: stage.stage_id, division_id: stage.division_id}}/>
                )
            }
        </>
    )
}