"use client"

import { useRouter } from "next/navigation"

export default function Signup() {

  const router = useRouter()

  return (

    <div className="min-h-screen grid md:grid-cols-2">

      {/* LEFT BRAND PANEL */}

      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-red-600 via-red-500 to-black text-white">

        <h1 className="text-2xl font-bold">Albdy</h1>

        <div className="max-w-md">

          <h2 className="text-5xl font-bold leading-tight">
            Profitable bookkeeping made simple
          </h2>

          <p className="mt-6 text-red-100">
            AI automatically tracks your revenue, expenses, and financial insights.
          </p>

        </div>

        <div className="text-sm text-red-200">
          © Albdy
        </div>

      </div>


      {/* RIGHT FORM */}

      <div className="flex items-center justify-center p-8 bg-white">

        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-6">
            Create your account
          </h2>

          <form className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-red-500"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-red-500"
            />

            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition"
            >
              Create Account
            </button>

          </form>

          <div className="my-6 text-center text-gray-400 text-sm">
            OR
          </div>

          <button className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50">
            Continue with Google
          </button>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-red-600 cursor-pointer"
            >
              Log in
            </span>
          </p>

        </div>

      </div>

    </div>

  )
}