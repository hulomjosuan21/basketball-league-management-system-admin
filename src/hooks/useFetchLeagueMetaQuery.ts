import { fetchLeagueMeta } from '@/services/league-service'
import { useQuery } from '@tanstack/react-query'

export function useFetchLeagueMetaQuery() {
  const {
    data: leagueMeta,
    isLoading: isLeagueMetaLoading,
    error: leagueMetaError,
    refetch: refetchLeagueMeta,
  } = useQuery({
    queryKey: ['league-meta'],
    queryFn: fetchLeagueMeta,
    staleTime: 5 * 60_000,
  })

  return {
    leagueMeta,
    isLeagueMetaLoading,
    leagueMetaError,
    refetchLeagueMeta,
  }
}
