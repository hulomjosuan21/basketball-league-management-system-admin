// app/api/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'))

  response.cookies.set({
    name: 'access_token_cookie',
    value: '',
    path: '/',
    maxAge: 0,
  })

  return response
}
