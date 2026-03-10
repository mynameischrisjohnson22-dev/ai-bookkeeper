"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import type { AxiosError } from "axios"

type ApiError = {
  error?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
    if (loading) return

    setError("")
    setEmailError("")
    setSuccess("")

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Enter a valid email address")
      return
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setLoading(true)

      await api.post("/api/auth/signup", {
        email: trimmedEmail,
        password: trimmedPassword,
      })

      setSuccess("Account created! Please check your email to verify.")

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

  const handleGoogleSignup = () => {
    if (!API_URL) return
    window.location.href = `${API_URL}/api/auth/google`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-6 p-8 border rounded-lg shadow-sm">

        <h1 className="text-2xl font-bold text-center">
          Create your account
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

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError("")
            }}
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">
              {emailError}
            </p>
          )}
        </div>

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Create Account */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="bg-black text-white px-4 py-3 rounded w-full disabled:opacity-50 hover:opacity-90 transition"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t"></div>
          <span className="mx-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t"></div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignup}
          className="border px-4 py-3 rounded w-full hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <span>Continue with Google</span>
        </button>

        {/* Login link */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="underline cursor-pointer"
          >
            Log in
          </span>
        </p>

      </div>
    </div>
  )
}