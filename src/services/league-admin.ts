"use server"

import { ApiResponse } from "@/lib/apiResponse";
import { getLeagueAdminFromToken } from "@/lib/auth";
import axiosClient from "@/lib/axiosClient";
import { TokenMissingError } from "@/lib/errors";
import { LeagueAdminType } from "@/models/league-administrator";

export async function fetchLeagueAdmin() {
    const admin = await getLeagueAdminFromToken();
    if (!admin) throw new TokenMissingError();

    const response = await axiosClient.client.get(`/entity/fetch/${admin.user_id}`)

    const apiResponse = ApiResponse.fromJson<{entity: LeagueAdminType}>(response.data)

    return apiResponse.payload?.entity
}