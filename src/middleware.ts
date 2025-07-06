import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY!)

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token_cookie")?.value
    const url = req.nextUrl.clone()

    if (!token) {
        if (url.pathname.startsWith("/league-administrator")) {
            url.pathname = "/auth/login"
            return NextResponse.redirect(url)
        }
        return NextResponse.next()
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        const accountType = payload.account_type as string

        if (url.pathname === "/auth/login" && accountType === "League_Administrator_Local") {
            url.pathname = "/league-administrator/pages/dashboard"
            return NextResponse.redirect(url)
        }

        if (url.pathname.startsWith("/league-administrator") && accountType !== "League_Administrator_Local") {
            url.pathname = "/unauthorized"
            return NextResponse.redirect(url)
        }

        return NextResponse.next()
    } catch {
        if (url.pathname.startsWith("/league-administrator")) {
            url.pathname = "/auth/login/pages/dashboard"
            return NextResponse.redirect(url)
        }

        return NextResponse.next()
    }
}

// export async function middleware(req: NextRequest) { }

export const config = {
    matcher: [
        "/auth/login",
        "/league-administrator/:path*",
    ],
}
