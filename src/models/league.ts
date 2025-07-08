export type LeagueType = {
    readonly league_id: string,
    league_title: string,
    status: string
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