import { useLeagueMeta } from '@/lib/stores/useLeagueMeta'
import { LeagueTeamSubmission } from '@/models/league'
import { fetchLeagueTeams } from '@/services/league-service'
import { useQuery } from '@tanstack/react-query'

export function useLeagueTeams(category_id?: string) {
  const { leagueMeta } = useLeagueMeta()
  const league_id = leagueMeta.league_meta?.league_id

  // 👉 Early return if no category_id
  if (!category_id || !league_id) {
    return {
      leagueTeams: [],
      leagueTeamsLoading: false,
      leagueTeamsError: null,
      refetchLeagueTeams: () => { },
    }
  }

  const query = useQuery<LeagueTeamSubmission[] | undefined, Error>({
    queryKey: ['league-teams', league_id, category_id],
    queryFn: () => fetchLeagueTeams(league_id, category_id),
    enabled: true,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return {
    leagueTeams: query.data ?? [],
    leagueTeamsLoading: query.isLoading,
    leagueTeamsError: query.error,
    refetchLeagueTeams: query.refetch,
  }
}
