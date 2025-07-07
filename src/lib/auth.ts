import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { TokenMissingError } from "./errors"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

export interface LeagueAdminClaims {
  readonly user_id: string
  readonly account_type: string,
  readonly league_administrator_id: string,
  readonly [key: string]: any
}

export async function getLeagueAdminFromToken(): Promise<LeagueAdminClaims | null> {
    const cookieStore = cookies()
    const token = (await cookieStore).get("access_token_cookie")?.value

    if (!token) {
      console.warn("No token found in cookies")
      return null
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

    return {
      user_id: payload.sub as string,
      account_type: payload.account_type as string,
      league_administrator_id: payload.league_administrator_id as string,
      ...payload,
    }
}
