import { MatchType } from '@/models/match/match-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ToMatchTeamStore {
  match?: MatchType
  setMatch: (match: MatchType) => void
  resetMatch: () => void
}

export const useToMatchTeamStore = create<ToMatchTeamStore>()(
  persist(
    (set) => ({
      match: undefined,
      setMatch: (match) => set({ match }),
      resetMatch: () => set({ match: undefined }),
    }),
    {
      name: 'to-match-team-storage',
      partialize: (state) => ({ match: state.match }),
    }
  )
)
