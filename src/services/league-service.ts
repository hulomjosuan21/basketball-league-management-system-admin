
"use server"
import { CreateLeagueFormValues } from "@/app/league-administrator/pages/league/create/create-league-form";
import { ApiResponse } from "@/lib/apiResponse";
import { getLeagueAdminFromToken } from "@/lib/auth";
import axiosClient from "@/lib/axiosClient";
import { TokenMissingError } from "@/lib/errors";
import { logout } from "@/lib/serverLogout";
import { LeagueMeta } from "@/lib/stores/useLeagueMeta";
import { LeagueResourceType, LeagueType } from "@/models/league";

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

export async function updateLeagueResource({data,league_id}:{data: Partial<LeagueResourceType>, league_id?: string}) {
  if(!league_id) throw new Error("No found league!")
  await axiosClient.client.put(`/league/resource/update/${league_id}`,data);
}

export async function fetchLeagueResource(league_id?: string) {
  if(!league_id) throw new Error("No found league!")
  const response = await axiosClient.client.get(`/league/resource/${league_id}`);

  const apiResponse = ApiResponse.fromJson<LeagueResourceType>(response.data);

  return apiResponse.payload
}

export const fetchLeagueMeta = async (): Promise<LeagueMeta> => {
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