"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import type { AxiosError } from "axios"

type ApiError = {
  error?: string
}

export default function Signup() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [emailError, setEmailError] = useState("")

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value)
  }

  const handleSignup = async () => {
    setError("")
    setEmailError("")
    setSuccess("")

    if (!validateEmail(email.trim())) {
      setEmailError("Enter a valid email address")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setLoading(true)

      await api.post("/api/auth/signup", {
        email: email.trim(),
        password: password.trim(),
      })

      // Show success message
      setSuccess("Account created! Please check your email to verify.")

      // Redirect after short delay
      setTimeout(() => {
        router.push("/login?verify=true")
      }, 2000)

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

        {success && (
          <div className="text-green-600 text-sm text-center">
            {success}
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