// types/MatchEnums.ts

export enum MatchCategory {
  REGULAR_SEASON = "Regular Season",   // Group stage or standard matches
  EXHIBITION = "Exhibition",           // Friendly, non-scoring matches
  ELIMINATION = "Elimination",         // Knockout matches
  QUARTERFINAL = "Quarterfinal",       // Top 8
  SEMIFINAL = "Semifinal",             // Top 4
  FINAL = "Final",                     // Final round
  THIRD_PLACE = "Third place",         // Bronze match
  PRACTICE = "Practice",               // Scrimmage or internal team match
}

export enum MatchStatus {
  SCHEDULED = "Scheduled",     // Not yet started
  IN_PROGRESS = "In Progress",         // Match in progress
  COMPLETED = "Completed",     // Finished
  CANCELLED = "Cancelled",     // Canceled
  POSTPONED = "Postponed",     // Delayed to another time
}

export type MatchSlotType = "home_team" | "away_team" | null

export type BracketSideType = "left" | "right" | "center" | null

export type PairingMethod = "manual" | "random" | "seeded" | null