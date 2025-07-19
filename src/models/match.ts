export function isDifferent<T>(a: T, b: T): boolean {
    return a !== b;
}
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

export type MatchTeamInfo = {
    team_name: string
    team_logo_url: string
    seed_number: number | null
}

export interface MatchType {
  // 🔑 Core Identification
  match_id: string
  league_id: string | null
  division: string | null

  // 👥 Team Information
  home_team_id: string
  home_team: MatchTeamInfo

  away_team_id: string
  away_team: MatchTeamInfo

  home_team_score: number | null
  away_team_score: number | null

  winner_team_id: string | null
  loser_team_id: string | null

  // 📅 Scheduling
  scheduled_date: Date
  duration_minutes: number
  court: string
  referees: string[]

  // 🧾 Match Details
  category: MatchCategory | null
  status: MatchStatus
  match_notes: string | null
  is_featured: boolean

  // 🧭 Bracket Navigation (Full Cycle Support)
  round_number: number | null            // e.g., 1 = Quarterfinal
  bracket_side: BracketSideType          // "left", "right", "center"
  bracket_position: string | null        // Vertical slot in the round

  previous_match_ids: string[]           // [0] feeds home, [1] feeds away
  next_match_id: string | null           // Next match winner will go to
  next_match_slot: MatchSlotType         // "home_team" or "away_team"

  loser_next_match_id: string | null     // For 3rd place/consolation
  loser_next_match_slot: MatchSlotType

  // 🛠️ Match Generation Details
  pairing_method: PairingMethod // How the match was generated
  generated_by: string | null // Admin ID or "system"

  // 🎯 Frontend Display Helpers
  display_name: string | null     // e.g., "Semifinal 1"
  is_final: boolean         // Optional UI flag
  is_third_place: boolean    // Optional UI flag

  // 📆 Audit Trail
  created_at: Date
  updated_at: Date
}

export type MatchCreateType = Pick<MatchType, "home_team_id" | "away_team_id" | "scheduled_date" | "duration_minutes" | "referees" | "court" | "category" | "division" | "league_id" | "round_number" | "bracket_side" | "bracket_position" | "match_notes">

export class MatchCreateModel implements MatchCreateType {
    home_team_id: string
    away_team_id: string
    scheduled_date: Date
    duration_minutes: number
    referees: string[]
    court: string
    category: MatchCategory | null
    division: string | null
    league_id: string | null
    round_number: number | null
    bracket_side: BracketSideType
    bracket_position: string | null
    match_notes: string | null

    constructor(data: MatchCreateType) {
        this.home_team_id = data.home_team_id
        this.away_team_id = data.away_team_id
        this.scheduled_date = data.scheduled_date
        this.duration_minutes = data.duration_minutes
        this.referees = data.referees 
        this.court = data.court
        this.category = data.category
        this.division = data.division
        this.league_id = data.league_id
        this.bracket_side = data.bracket_side
        this.bracket_position = data.bracket_position
        this.round_number = data.round_number
        this.match_notes = data.match_notes
    }

    toJson(): MatchCreateType {
        return { ...this }
    }
}

export class MatchModel implements MatchType {
    match_id: string
    home_team_id: string
    away_team_id: string
    home_team: MatchTeamInfo
    away_team: MatchTeamInfo
    home_team_score: number | null
    away_team_score: number | null
    scheduled_date: Date
    duration_minutes: number
    referees: string[]
    court: string
    category: MatchCategory | null
    status: MatchStatus
    division: string | null
    round_number: number | null
    bracket_side: BracketSideType
    bracket_position: string | null
    winner_team_id: string | null
    loser_team_id: string | null
    next_match_id: string | null
    next_match_slot: MatchSlotType
    loser_next_match_id: string | null
    loser_next_match_slot: MatchSlotType
    previous_match_ids: string[]
    match_notes: string | null
    is_featured: boolean
    created_at: Date
    updated_at: Date
    league_id: string | null
    pairing_method: PairingMethod
    generated_by: string | null
    display_name: string | null
    is_final: boolean
    is_third_place: boolean
    
    constructor(data: MatchType) {
        this.match_id = data.match_id
        this.home_team_id = data.home_team_id
        this.away_team_id = data.away_team_id
        this.home_team = data.home_team
        this.away_team = data.away_team
        this.home_team_score = data.home_team_score
        this.away_team_score = data.away_team_score
        this.scheduled_date = data.scheduled_date
        this.duration_minutes = data.duration_minutes
        this.referees = data.referees
        this.court = data.court
        this.category = data.category
        this.status = data.status
        this.division = data.division
        this.round_number = data.round_number
        this.bracket_side = data.bracket_side
        this.bracket_position = data.bracket_position
        this.winner_team_id = data.winner_team_id
        this.loser_team_id = data.loser_team_id
        this.next_match_id = data.next_match_id
        this.next_match_slot = data.next_match_slot
        this.loser_next_match_id = data.loser_next_match_id
        this.loser_next_match_slot = data.loser_next_match_slot
        this.previous_match_ids = data.previous_match_ids
        this.match_notes = data.match_notes
        this.is_featured = data.is_featured
        this.created_at = new Date(data.created_at)
        this.updated_at = new Date(data.updated_at)
        this.league_id = data.league_id
        this.pairing_method = data.pairing_method
        this.generated_by = data.generated_by
        this.display_name = data.display_name
        this.is_final = data.is_final
        this.is_third_place = data.is_third_place
    }


    toJson(): MatchType {
        return { ...this }
    }

    static fromJson(data: MatchType): MatchModel {
        return new MatchModel(data)
    }

    copyWith(update: Partial<MatchType>): MatchModel {
        return new MatchModel({
            ...this.toJson(),
            ...update,
        })
    }

    toChangedJson(update: Partial<MatchType>): Partial<MatchType> {
        const original = this.toJson()
        const changed: Record<string, unknown> = {}
        const keys = Object.keys(update) as (keyof MatchType)[]

        for (const key of keys) {
            const updatedValue = update[key]
            const originalValue = original[key]

            if (isDifferent(updatedValue, originalValue)) {
                changed[key as string] = updatedValue
            }
        }

        return changed as Partial<MatchType>
    }
}
