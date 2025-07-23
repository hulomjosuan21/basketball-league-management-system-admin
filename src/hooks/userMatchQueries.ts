import { ApiResponse } from '@/lib/apiResponse'
import axiosClient from '@/lib/axiosClient'
import { GenerateOptions, MatchStatus, MatchType } from '@/models/match/match-types'
import { useQuery } from '@tanstack/react-query'

type CheckMatchOptions = {
  category: string
  league_id: string
  division_id: string
}

type CheckMatchResponse = {
  message: string
  payload: {
    exists: boolean
    total: number
  }
  status: boolean
}

export function useCheckMatchExists(
  options: CheckMatchOptions,
  enabled: boolean = true
) {
  const queryKey = [
    'check-match-exists',
    options.league_id,
    options.category,
    options.division_id,
  ]

  return useQuery<CheckMatchResponse>({
    queryKey,
    queryFn: async () => {
      const response = await axiosClient.client.post('/match/check-exists', options)
      return response.data
    },
    enabled,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })
}

export function useMatch({league_id, division_id, status}:{league_id?: string, division_id?: string, status?: MatchStatus}) {
  const query = useQuery<MatchType[] | undefined, Error>({
    queryKey: ['match-with-teams',league_id,division_id,status],
    queryFn: async () => {
      const options:Partial<GenerateOptions> = {
        league_id,
        division_id,
        status
      }
      const response = await axiosClient.client.post('/match/all',options)
      const apiResponse = ApiResponse.fromJson<MatchType[]>(response.data)

      return apiResponse.payload;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!league_id && !!division_id && !!status
  })

  return {
    match: query.data ?? [],
    matchLoading: query.isLoading,
    matchError: query.error,
    matchRefetch: query.refetch
  }
}