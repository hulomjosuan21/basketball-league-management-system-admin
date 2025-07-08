'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { encryptedStorage } from '../encryptedStorage'
import { LeagueType } from '@/models/league'

export type LeagueMeta = {
  has_league: boolean
  league_meta?: Partial<LeagueType>
  // ✅ Add more fields here later, for example:
}

type LeagueMetaState = {
  leagueMeta: LeagueMeta
  setLeagueMeta: (meta: LeagueMeta) => void
  updateLeagueMeta: (meta: Partial<LeagueMeta>) => void
  resetLeagueMeta: () => void
}

export const useLeagueMeta = create<LeagueMetaState>()(
  persist(
    (set) => ({
      leagueMeta: {
        has_league: false,
        league_meta: undefined

        // ✅ Add initial values for new fields here too
      },
      setLeagueMeta: (meta) => set({ leagueMeta: meta }),

      updateLeagueMeta: (meta) =>
        set((state) => ({
          leagueMeta: {
            ...state.leagueMeta,
            ...meta, // ✅ Automatically merges new fields
          },
        })),

      resetLeagueMeta: () =>
        set({
          leagueMeta: {
            has_league: false,
            league_meta: undefined

            // ✅ Reset additional fields here when added
            // has_league: false,
          },
        }),
    }),
    {
      name: 'league-meta-store', // localStorage key
      storage: encryptedStorage
    }
  )
)
