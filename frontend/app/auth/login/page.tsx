"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import type { AxiosError } from "axios"

type LoginResponse = {
  token: string
  user: { id: string }
}

type ApiError = { error?: string }

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

      const res = await api.post<LoginResponse>(
        "/api/auth/login",
        {
          email: email.trim(),
          password: password.trim()
        }
      )

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userId", res.data.user.id)

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
      <div className="w-full max-w-md p-8 border rounded-lg shadow-sm space-y-6">

        <h1 className="text-2xl font-bold text-center">
          Login
        </h1>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 w-full rounded"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-black text-white px-4 py-3 rounded w-full disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="relative text-center text-sm text-gray-400">
          OR
        </div>

        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
          className="border px-4 py-3 rounded w-full block text-center hover:bg-gray-50"
        >
          Continue with Google
        </a>

      </div>
    </div>
  )
}