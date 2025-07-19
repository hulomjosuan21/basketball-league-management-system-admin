import { MatchTeam } from '@/models/league'
import { create } from 'zustand'

type MatchTeamState = {
  homeTeam: MatchTeam | null
  awayTeam: MatchTeam | null
  setHomeTeam: (team: MatchTeam | null) => void
  setAwayTeam: (team: MatchTeam | null) => void
}

export const useMatchTeamStore = create<MatchTeamState>((set) => ({
  homeTeam: null,
  awayTeam: null,
  setHomeTeam: (team) => set({ homeTeam: team }),
  setAwayTeam: (team) => set({ awayTeam: team }),
}))
