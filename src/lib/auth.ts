import { AccountTypeEnum } from "@/enums/AccountTypeEnum";
import { accountTypeFromValue } from "@/helpers/AccountTypeEnumHelper"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET_KEY!

export async function getUserFromToken(): Promise<{
    user_id: string;
    account_type: AccountTypeEnum | undefined;
} | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token_cookie")?.value

    if (!token) return null

    try {
        const payload = jwt.verify(token, JWT_SECRET) as {
            sub: string
            account_type: string
        }

        return {
            user_id: payload.sub,
            account_type: accountTypeFromValue(payload.account_type),
        }
    } catch {
        return null
    }
}
