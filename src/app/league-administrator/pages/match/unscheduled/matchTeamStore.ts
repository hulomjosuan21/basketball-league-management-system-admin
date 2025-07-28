import { create } from "zustand"
import { persist } from "zustand/middleware"
import { MatchType } from "@/models/match/match-types"

type MatchStore = {
  data: MatchType | null
  open: boolean
  stage: {
    stage_id: string | null
    division_id: string | null
  }

  openSheet: (data: MatchType) => void
  closeSheet: () => void
  setStage: (stage_id: string, division_id: string) => void
  resetStage: () => void
}

export const usePersistentMatchStore = create<MatchStore>()(
  persist(
    (set) => ({
      data: null,
      open: false,
      stage: {
        stage_id: null,
        division_id: null,
      },

      openSheet: (data) => set({ open: true, data }),
      closeSheet: () => set({ open: false, data: null }),
      setStage: (stage_id, division_id) =>
        set({ stage: { stage_id, division_id } }),
      resetStage: () =>
        set({ stage: { stage_id: null, division_id: null } }),
    }),
    {
      name: "match-store",
      partialize: (state) => ({ data: state.data }),
    }
  )
)
