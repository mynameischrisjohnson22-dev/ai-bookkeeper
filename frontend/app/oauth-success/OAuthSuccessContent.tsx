"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function OAuthSuccessContent() {

  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {

    const token = params?.get("token")

    if (token) {
      localStorage.setItem("token", token)
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }

  }, [params, router])

  return <p className="text-gray-500">Completing login...</p>
}