"use client"

import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function Login() {

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    setLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (

    <div className="min-h-screen grid md:grid-cols-2">

      {/* LEFT PANEL */}

      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-red-600 via-red-500 to-black text-white">

        <h1 className="text-2xl font-bold">
          Albdy
        </h1>

        <div className="max-w-md">

          <h2 className="text-5xl font-bold leading-tight">
            AI bookkeeping made simple
          </h2>

          <p className="mt-6 text-red-100">
            Track revenue, expenses, and profits automatically.
          </p>

        </div>

        <p className="text-sm text-red-200">
          © Albdy
        </p>

      </div>


      {/* RIGHT LOGIN */}

      <div className="flex items-center justify-center p-8 bg-white">

        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-6">
            Sign in
          </h2>

          <form className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition"
            >
              Login
            </button>

          </form>

          <div className="my-6 text-center text-gray-400 text-sm">
            OR
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Don't have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-red-600 cursor-pointer hover:underline"
            >
              Create one
            </span>
          </p>

        </div>

      </div>

    </div>
  )
}