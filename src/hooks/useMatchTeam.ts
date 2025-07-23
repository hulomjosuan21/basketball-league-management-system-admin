import { useLeagueMeta } from "@/lib/stores/useLeagueMeta";
import { MatchTeam } from "@/models/match";
import { fetchMatchTeamsByCategories } from "@/services/league-service";
import { useQuery } from "@tanstack/react-query";

export function useMatchTeams(category_id: string) {
    const { leagueMeta } = useLeagueMeta();
    const league_id = leagueMeta.league_meta?.league_id

    if (!category_id || !league_id) {
        return {
            matchTeams: [],
            matchTeamsLoading: false,
            matchTeamsError: null,
            refetchMatchTeams: () => { },
        }
    }

  const query = useQuery<MatchTeam[] | undefined, Error>({
    queryKey: ['match-teams-by-category', league_id, category_id],
    queryFn: () => fetchMatchTeamsByCategories(league_id, category_id),
    enabled: !!league_id,
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

