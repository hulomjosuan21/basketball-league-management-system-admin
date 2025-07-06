import { ApiResponse } from "@/lib/apiResponse";
import axiosClient from "@/lib/axiosClient";

export async function login(loginPayload: FormData): Promise<ApiResponse<void>> {
    const res = await axiosClient.client.post("/entity/league-administrator/login", loginPayload)
    return ApiResponse.fromJsonNoPayload<void>(res.data)
}
