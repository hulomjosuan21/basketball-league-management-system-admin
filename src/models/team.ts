export interface Team {
    readonly team_id: string,
    team_name: string,
    description?: string,
    isPaid: boolean,
    created_at: Date
}