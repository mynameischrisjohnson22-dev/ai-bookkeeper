"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import type { AxiosError } from "axios"

type LoginResponse = {
  token: string
  user: {
    id: string
  }
}

type ApiError = {
  error?: string
}

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const handleLogin = async () => {
    setError("")

    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    try {
      setLoading(true)

      const { data } = await api.post<LoginResponse>(
        "/api/auth/login",
        { email, password }
      )

      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.user.id)

      router.push("/dashboard")
    } catch (err) {
      const error = err as AxiosError<ApiError>

      setError(
        error.response?.data?.error ??
        "Login failed. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  )
}
