import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY!)

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token_cookie")?.value
    const url = req.nextUrl.clone()
    const path = url.pathname

    // If user is not authenticated
    if (!token) {
        if (path === "/league-administrator" || path.startsWith("/league-administrator")) {
            url.pathname = "/auth/login"
            return NextResponse.redirect(url)
        }
        return NextResponse.next()
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        const accountType = payload.account_type as string

        // Redirect League Admin who tries to visit login page
        if (path === "/auth/login" && accountType === "League_Administrator_Local") {
            url.pathname = "/league-administrator/pages/dashboard"
            return NextResponse.redirect(url)
        }

        // If user is not a League Admin but trying to access admin pages
        if (path === "/league-administrator" || path.startsWith("/league-administrator")) {
            if (accountType !== "League_Administrator_Local") {
                url.pathname = "/unauthorized"
                return NextResponse.redirect(url)
            }
        }

        return NextResponse.next()
    } catch {
        // Invalid or expired token
        if (path === "/league-administrator" || path.startsWith("/league-administrator")) {
            url.pathname = "/auth/login"
            return NextResponse.redirect(url)
        }

        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        "/auth/login",
        "/league-administrator",
        "/league-administrator/:path*",
    ],
}
