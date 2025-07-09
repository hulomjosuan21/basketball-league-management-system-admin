import { useQuery } from '@tanstack/react-query'
import { fetchLeagueAdmin } from "@/services/league-admin"

export function useLeagueAdmin() {
  return useQuery({
    queryKey: ['fetch-league-admin'],
    queryFn: fetchLeagueAdmin,
    staleTime: 5 * 60_000,
  })
}
