import { create } from "zustand"
import { persist } from "zustand/middleware"
import { MatchType } from "@/models/match/match-types"

type MatchStore = {
    data: MatchType | null
    stage: {
        stage_id: string | null
        division_id: string | null
    }

    setData: (data: MatchType) => void
    clearData: () => void
    setStage: (stage_id: string, division_id: string) => void
    resetStage: () => void
}

export const usePersistentStartMatchStore = create<MatchStore>()(
    persist(
        (set) => ({
            data: null,
            stage: {
                stage_id: null,
                division_id: null,
            },

            setData: (data) => set({ data }),
            clearData: () => set({ data: null }),
            setStage: (stage_id, division_id) =>
                set({ stage: { stage_id, division_id } }),
            resetStage: () =>
                set({ stage: { stage_id: null, division_id: null } }),
        }),
        {
            name: "match-start-store",
            partialize: (state) => ({ data: state.data }),
        }
    )
)
