import { useLeagueMeta } from "@/lib/stores/useLeagueMeta";
import { MatchStagingType } from "@/models/match/match-types";
import { fetchAllLeagueStaging, fetchLeagueResource } from "@/services/league-service";
import { useQuery } from "@tanstack/react-query";

export function useLeagueStaging() {
  const { leagueMeta } = useLeagueMeta()
  const league_id = leagueMeta.league_meta?.league_id

  const query = useQuery<MatchStagingType[]>({
    queryKey: ['league-staging', league_id],
    queryFn: () => fetchAllLeagueStaging(league_id),
    enabled: !!league_id && leagueMeta.has_league,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  return {
    leagueStaging: query.data ?? [],
    leagueStagingLoading: query.isLoading,
    leagueStagingError: query.error,
    leagueStagingRefetch: query.refetch,
    leagueMeta: leagueMeta
  }
}