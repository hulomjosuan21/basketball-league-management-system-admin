import { createSheetStore } from "@/lib/stores/useSheetStore";
import { MatchStagingType } from "@/models/match/match-types";

export const useMatchStageSheet = createSheetStore<Partial<MatchStagingType>>()