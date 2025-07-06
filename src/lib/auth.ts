import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { TokenMissingError } from "./errors"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

export interface DecodedUser {
  user_id: string
  account_type: string
  [key: string]: any
}

export async function getUserFromToken(): Promise<DecodedUser | null> {
  try {
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
      ...payload,
    }
  } catch (err) {
    throw new TokenMissingError()
  }
}
