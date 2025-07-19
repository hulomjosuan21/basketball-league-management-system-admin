import { useLeagueMeta } from '@/lib/stores/useLeagueMeta'
import { fetchCurrentLeagueQueries } from '@/services/league-service'
import { useQuery } from '@tanstack/react-query'
import { LeagueCategories } from '@/models/league'

export function useLeagueCategories() {
  const { leagueMeta } = useLeagueMeta()
  const league_id = leagueMeta.league_meta?.league_id

  const query = useQuery<LeagueCategories[] | undefined, Error>({
    queryKey: ['league-categories', league_id],
    queryFn: () => fetchCurrentLeagueQueries(league_id!),
    enabled: !!league_id,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return {
    leagueCategories: query.data ?? [],
    leagueCategoriesLoading: query.isLoading,
    leagueCategoriesError: query.error,
    refetchLeagueCategories: query.refetch,
  }
}
