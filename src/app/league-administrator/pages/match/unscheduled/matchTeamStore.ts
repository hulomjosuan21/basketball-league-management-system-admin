import { create } from "zustand"
import { persist } from "zustand/middleware"
import { MatchType } from "@/models/match/match-types"

type MatchStore = {
  match?: MatchType
  resetMatch: () => void

  open: boolean
  data: MatchType | null
  openSheet: (data: MatchType) => void
  closeSheet: () => void
}

export const usePersistentMatchStore = create<MatchStore>()(
  persist(
    (set) => ({
      match: undefined,
      resetMatch: () => set({ match: undefined }),

      open: false,
      data: null,
      openSheet: (data) => set({ open: true, data }),
      closeSheet: () => set({ open: false, data: null }),
    }),
    {
      name: "match-store",
      partialize: (state) => ({ match: state.match }), // only persist match
    }
  )
)
