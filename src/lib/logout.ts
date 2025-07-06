"use client"

import { useRouter } from "next/navigation"

export function useLogout() {
  const router = useRouter()

  return async function logout() {
    await fetch("/api/logout", { method: "POST" })
    router.push("/auth/login")
  }
}
