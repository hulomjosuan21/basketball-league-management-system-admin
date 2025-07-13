import { useLeagueMeta } from "@/lib/stores/useLeagueMeta";
import { fetchLeagueTeams } from "@/services/league-service";
import { useQuery } from "@tanstack/react-query";

export function useLeagueTeam() {
  const { leagueMeta } = useLeagueMeta();

  const query = useQuery({
    queryKey: ['league-teams', leagueMeta.league_meta?.league_id],
    queryFn: () => fetchLeagueTeams(leagueMeta.league_meta?.league_id),
    
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: false,
    refetchIntervalInBackground: false,

    enabled: !!leagueMeta.league_meta?.league_id,
  });

  return {
    leagueMeta,
    leagueTeam: query.data,
    leagueTeamLoading: query.isLoading,
    leagueTeamError: query.error,
    refetchTeamResource: query.refetch,
  };
}
