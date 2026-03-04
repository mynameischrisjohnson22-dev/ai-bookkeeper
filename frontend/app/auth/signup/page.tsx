"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
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
  const [emailError, setEmailError] = useState("")

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  }

  const handleSignup = async () => {
    setError("")
    setEmailError("")

    if (!validateEmail(email)) {
      setEmailError("Enter a valid email address")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setLoading(true)

      const response = await api.post<SignupResponse>(
        "/api/auth/signup",
        {
          email: email.trim(),
          password: password.trim(),
        }
      )

      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("userId", user.id)

      router.push("/dashboard")
      router.refresh()

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-6 p-8 border rounded-lg shadow-sm">

        <h1 className="text-2xl font-bold text-center">
          Sign Up
        </h1>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError("")
            }}
            className="border p-3 w-full rounded"
            required
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">
              {emailError}
            </p>
          )}
        </div>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 w-full rounded"
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="bg-black text-white px-4 py-3 rounded w-full disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

      </div>
    </div>
  )
}