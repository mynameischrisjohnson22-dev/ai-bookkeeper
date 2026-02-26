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

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password")
      return
    }

    try {
      setLoading(true)

      const response = await api.post<LoginResponse>(
        "/api/auth/login",
        {
          email: email.trim(),
          password: password.trim(),
        }
      )

      const token = response.data?.token
      const userId = response.data?.user?.id

      if (!token) {
        throw new Error("No token returned from server")
      }

      // Save auth
      localStorage.setItem("token", token)

      if (userId) {
        localStorage.setItem("userId", userId)
      }

      // Force refresh so app picks up auth state
      router.push("/dashboard")
      router.refresh()

    } catch (err) {
      const axiosError = err as AxiosError<ApiError>

      setError(
        axiosError.response?.data?.error ||
        "Invalid email or password"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-6 p-8 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <input
          className="border p-3 w-full rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-3 w-full rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-black text-white px-4 py-3 rounded w-full disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  )
}