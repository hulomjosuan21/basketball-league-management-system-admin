// lib/auth/serverLogout.ts
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function logout(): Promise<Response> {
  const cookieStore = await cookies()

  cookieStore.set("access_token_cookie", "", {
    path: "/",
    maxAge: 0,
  })

  return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_BASE_URL))
}
