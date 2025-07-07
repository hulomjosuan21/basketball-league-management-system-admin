
"use server"
import { CreateLeagueFormValues } from "@/app/league-administrator/pages/league/create/create-league-form";
import { ApiResponse } from "@/lib/apiResponse";
import { getLeagueAdminFromToken } from "@/lib/auth";
import axiosClient from "@/lib/axiosClient";
import { TokenMissingError } from "@/lib/errors";
import { LeagueMeta } from "@/lib/stores/useLeagueMeta";

export async function createNewLeague(formData: FormData) {
    const admin = await getLeagueAdminFromToken();
    if (!admin?.league_administrator_id) throw new TokenMissingError();
    formData.append("league_administrator_id", admin.league_administrator_id);

    const response = await axiosClient.client.post("/league/create-new", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    const apiResponse =  ApiResponse.fromJsonNoPayload<void>(response.data);

    return apiResponse.toJSON();
}

export const fetchLeagueMeta = async (): Promise<LeagueMeta> => {
  const res = await axiosClient.client.get('/league/get-league-meta/test')

  const parsed = ApiResponse.fromJson<LeagueMeta>(res.data)

  if (!parsed.status || !parsed.payload) {
    throw new Error(parsed.message || 'Failed to fetch league meta')
  }

  return parsed.payload
}