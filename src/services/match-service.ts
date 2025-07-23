import { GenerateOptions, MatchType } from '@/models/match/match-types';
import { ApiResponse } from './../lib/apiResponse';
import axiosClient from "@/lib/axiosClient";

export async function GenerateUnscheduledMatches(options: Partial<GenerateOptions>) {
  const response = await axiosClient.client.post('/match/generate', { options })
  const apiResponse = ApiResponse.fromJson<{ exists: boolean; total: number }>(response.data)
  return apiResponse
}

export async function RematchUnscheduledMatches(options: Partial<GenerateOptions>) {
  const response = await axiosClient.client.post('/match/rematch', { options })
  const apiResponse = ApiResponse.fromJson<{ exists: boolean; total: number }>(response.data)
  return apiResponse
}

export async function scheduleMatch(data: Partial<MatchType>) {
  const response = await axiosClient.client.put('/match/schedule', data)
  const apiResponse = ApiResponse.fromJsonNoPayload(response.data)
  return apiResponse
}