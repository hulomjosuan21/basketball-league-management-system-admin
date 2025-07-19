export type LeagueType = {
    readonly league_id: string;
    league_title: string;
    status: string;
    banner_url: string | null;
}

export type LeagueCategories = {
    readonly category_id: string;
    category_name: string;
    entrance_fee_amount: number;
    readonly league_id: string;
}

export type LeagueTeamSubmission = {
  readonly league_team_id: string;
  readonly team_id: string;
  team_logo_url: boolean;
  team_name: string;
  amount_paid: number;
  payment_status: string;
  status: string;
  email: string;
  contact_number: string;
  category_id: string;
};

export type MatchTeam = {
    readonly category_id: string;
    readonly league_team_id: string;
    status: string;
    readonly team_id: string;
    team_logo_url?: string;
    team_name: string;
}

export type LeagueResourceType = {
  league_resource_id: string
  league_id: string
  league_courts: CourtType[]
  league_referees: RefereeType[],
  league_sponsors: SponsorType[],
  created_at: string
  updated_at: string
}

export type CourtType = {
    court_name: string,
    court_address: string
}

export type SponsorType = {
    sponsor_name: string,
    sponsorship_value: string
}

export type RefereeType = {
    referee_full_name: string,
    referee_address: string,
    referee_contact_number: string,
}

export type LeagueTeamType = {

}

export type LeagueMatchTeamBasicInfoType = {
    team_name: string;
    team_logo_url: string;
}