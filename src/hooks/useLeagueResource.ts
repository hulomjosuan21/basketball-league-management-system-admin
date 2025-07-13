import { useLeagueMeta } from "@/lib/stores/useLeagueMeta"
import { fetchLeagueResource } from "@/services/league-service"
import { useQuery } from "@tanstack/react-query"

export function useLeagueResource() {
    const { leagueMeta } = useLeagueMeta()
    const query = useQuery({
        queryKey: ['league-resource'],
        queryFn: () => fetchLeagueResource(leagueMeta.league_meta?.league_id),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      })

    return {leagueMeta, leagueResource: query.data, leagueResourceLoading: query.isLoading, leagueResourceError: query.error, refetchLeagueResource: query.refetch}
}