import { useLeagueMeta } from "@/lib/stores/useLeagueMeta";
import { MatchTeamType, MatchType } from "@/models/match/match-types";
import { fetchStageMatch } from "@/services/league-service";
import { useQuery } from "@tanstack/react-query";

export type MatchTeamUnscheduledType = {
    stage_id: string;
    category_id: string;
    status?: string;
}
export function useMatchTeams({stage_id, category_id, status = "Unscheduled"}:MatchTeamUnscheduledType) {
  const options:MatchTeamUnscheduledType = {
    stage_id,
    category_id,
    status
  }

  const query = useQuery<MatchType[] | undefined, Error>({
    queryKey: ['match-teams-by-category', stage_id, category_id],
    queryFn: () => fetchStageMatch(options),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return {
    matchTeams: query.data ?? [],
    matchTeamsLoading: query.isLoading,
    matchTeamsError: query.error,
    refetchMatchTeams: query.refetch,
  }
}