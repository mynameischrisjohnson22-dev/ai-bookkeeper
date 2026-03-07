"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center">

      <h1 className="text-4xl font-bold tracking-tight">
        Albdy
      </h1>

      <p className="text-gray-600 max-w-md">
        Your automated business finance assistant
      </p>

      <div className="flex gap-4">

        <button
          onClick={() => router.push("/auth/login")}
          className="bg-black text-white px-5 py-2.5 rounded-md hover:bg-gray-800 transition"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/auth/signup")}
          className="border border-gray-300 px-5 py-2.5 rounded-md hover:bg-gray-100 transition"
        >
          Sign Up
        </button>

      </div>

    </div>
  )
}