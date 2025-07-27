export type MatchTeamType = {
  readonly category_id: string;
  readonly league_team_id: string;
  status: string;
  readonly team_id: string;
  team_logo_url?: string;
  team_name: string;
  email: string;
  contact_number: string;
};

export type DivisionType = {
  readonly category_id: string;
  readonly category_name: string;
  readonly entrance_fee_amount: number;
  readonly league_id: string;
}

export interface LeagueTeamStanding {
  league_team_id: string;
  team_id: string;
  team_name: string;
  team_logo_url?: string;

  games_played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  scored: number;
  conceded: number;
  score_difference: number;
  rank: number | null;
}

export enum MatchCategory {
  REGULAR_SEASON = "Regular Season",
  EXHIBITION = "Exhibition",
  ELIMINATION = "Elimination",
  QUARTERFINAL = "Quarterfinal",
  SEMIFINAL = "Semifinal",
  FINAL = "Final",
  THIRD_PLACE = "Third place",
  PRACTICE = "Practice",
}

export enum MatchStatus {
  UNSCHEDULED = "Unscheduled",
  SCHEDULED = "Scheduled",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  POSTPONED = "Postponed",
}

export type MatchSlotType = "home_team" | "away_team" | null;
export type BracketSideType = "left" | "right" | "center" | null;
export type PairingMethod = "manual" | "random" | "seeded" | null;

export interface TeamScheduleConfig {
  league_team_id: string;
  team_name: string;
  team_id: string;
  category_id: string;
}

export interface GenerateOptions {
  durationMinutes: number;
  category: MatchCategory;
  league_id?: string;
  division_id: string;
  status: MatchStatus;
}

export interface MatchType {
  match_id: string;
  league_id: string;
  division_id: string;
  division: DivisionType

  home_team_id: string;
  home_team: MatchTeamType;
  away_team_id: string;
  away_team: MatchTeamType;

  home_team_score: number | null;
  away_team_score: number | null;
  winner_team_id: string | null;
  loser_team_id: string | null;

  scheduled_date: string | null;
  duration_minutes: number;
  court: string;
  referees: string[];

  category: MatchCategory | null;
  status: MatchStatus;
  match_notes: string | null;
  is_featured: boolean;

  round_number: number | null;
  bracket_side: BracketSideType;
  bracket_position: string | null;
  previous_match_ids: string[];
  next_match_id: string | null;
  next_match_slot: MatchSlotType;
  loser_next_match_id: string | null;
  loser_next_match_slot: MatchSlotType;

  pairing_method: PairingMethod;
  generated_by: string | null;
  display_name: string | null;
  is_final: boolean;
  is_third_place: boolean;

  created_at: string;
  updated_at: string;
}

export enum FormatType {
  ROUND_ROBIN = "Round Robin",
  KNOCKOUT = "Knockout",
  DOUBLE_ELIMINATION = "Double Elimination"
}

export interface MatchStagingType {
  stage_id: string;

  league_id: string;
  division_id: string;
  division: DivisionType;

  category: MatchCategory;
  pairing_method: PairingMethod;
  format_type: FormatType;

  is_active: boolean;
  is_completed: boolean;

  top_n_teams: number | null;
  auto_generate: boolean;
  vs_teams_generated: boolean;

  match_options: GenerateOptions;
  created_by: string;

  created_at: string;
  updated_at: string;
}
