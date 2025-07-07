'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { encryptedStorage } from '../encryptedStorage'

export type LeagueMeta = {
  has_league: boolean

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
