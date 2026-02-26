"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "../../../lib/api"
import type { AxiosError } from "axios"

type SignupResponse = {
  token: string
  user: {
    id: string
  }
}

type ApiError = {
  error?: string
}

export default function Signup() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async () => {
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password")
      return
    }

    try {
      setLoading(true)

      const response = await api.post<SignupResponse>(
        "/api/auth/signup",
        { email, password }
      )

      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("userId", user.id)

      router.push("/dashboard")
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>

      setError(
        axiosError.response?.data?.error ||
        "Signup failed. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>

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
        onClick={handleSignup}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </div>
  )
}