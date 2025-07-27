
"use server"
import { StagingGenerateOptionType } from "@/app/league-administrator/pages/match/staging-options/form";
import { MatchTeamUnscheduledType } from "@/hooks/useMatchTeam";
import { ApiResponse } from "@/lib/apiResponse";
import { getLeagueAdminFromToken } from "@/lib/auth";
import axiosClient from "@/lib/axiosClient";
import { TokenMissingError } from "@/lib/errors";
import { logout } from "@/lib/serverLogout";
import { LeagueMeta } from "@/lib/stores/useLeagueMeta";
import { LeagueCategories, LeagueResourceType, LeagueTeamSubmission, LeagueType } from "@/models/league";
import { MatchStagingType, MatchTeamType, MatchType } from "@/models/match/match-types";

export async function createNewLeague(formData: FormData) {
  const admin = await getLeagueAdminFromToken();
  if (!admin?.league_administrator_id) throw new TokenMissingError();
  formData.append("league_administrator_id", admin.league_administrator_id);

  const response = await axiosClient.client.post("/league/create-new", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const apiResponse = ApiResponse.fromJsonNoPayload<void>(response.data);

  return apiResponse.toJSON();
}

export async function updateLeagueResource({ data, league_id }: { data: Partial<LeagueResourceType>, league_id?: string }) {
  if (!league_id) throw new Error("No found league!")
  await axiosClient.client.put(`/league/resource/update/${league_id}`, data);
}

export async function fetchLeagueResource(league_id?: string) {
  if (!league_id) throw new Error("No found league!")
  const response = await axiosClient.client.get(`/league/resource/${league_id}`);

  const apiResponse = ApiResponse.fromJson<LeagueResourceType>(response.data);

  return apiResponse.payload
}

export async function fetchLeagueMeta(): Promise<LeagueMeta> {
  try {
    const admin = await getLeagueAdminFromToken()

    if (!admin) {
      throw new TokenMissingError()
    }

    const res = await axiosClient.client.get(
      `/league/meta/${admin.league_administrator_id}`
    )

    const parsed = ApiResponse.fromJson<LeagueMeta>(res.data)

    if (!parsed.status || !parsed.payload) {
      throw new Error(parsed.message || "Failed to fetch league meta")
    }

    return parsed.payload
  } catch (error) {
    if (error instanceof TokenMissingError) {
      await logout()
    }
    throw error
  }
}

export async function fetchLeagueTeams(league_id: string, category_id: string) {
  const response = await axiosClient.client.get(`/league/league-team?league_id=${league_id}&category_id=${category_id}`);

  const apiResponse = ApiResponse.fromJson<LeagueTeamSubmission[]>(response.data);

  return apiResponse.payload
}

export async function generateLeaguePDF(): Promise<string> {
  const response = await axiosClient.client.get(`/league/generate-pdf`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}

export async function updateLeagueTeam({ league_team_id, fields }: { league_team_id: string, fields: Partial<LeagueTeamSubmission> }) {
  const response = await axiosClient.client.put(`/league/league-team/update/${league_team_id}`, JSON.stringify(fields), {
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const apiResponse = ApiResponse.fromJsonNoPayload<void>(response.data);

  return apiResponse.toJSON();
}

export async function updateLeagueBanner({ league_id, formData }: { league_id: string, formData: FormData }) {
  const response = await axiosClient.client.patch(`/league/update/banner/${league_id}`, formData)

  const apiResponse = ApiResponse.fromJsonNoPayload<void>(response.data);

  return apiResponse.toJSON();
}

export async function fetchCurrentLeagueQueries(league_id: string) {
  const response = await axiosClient.client.get(`/league/current/categories/${league_id}`)
  const apiResponse = ApiResponse.fromJson<LeagueCategories[]>(response.data)
  return apiResponse.payload;
}

export async function fetchStageMatch(options:MatchTeamUnscheduledType) {
  const response = await axiosClient.client.post(`/match/all`,options)
  const apiResponse = ApiResponse.fromJson<MatchType[]>(response.data)
  return apiResponse.payload;
}

export async function fetchAllLeagueStaging(league_id?: string) {
  if (!league_id) throw new Error("No found league!")
  const response = await axiosClient.client.get(`/match/all/stage/${league_id}`)
  const apiResponse = ApiResponse.fromJson<MatchStagingType[]>(response.data)
  return apiResponse.payload ?? [];
}

export async function generateStagingMatch(data:StagingGenerateOptionType) {
  const response = await axiosClient.client.post(`/match/generate`,data)
  const apiResponse = ApiResponse.fromJsonNoPayload<void>(response.data)
  return apiResponse.toJSON();
}