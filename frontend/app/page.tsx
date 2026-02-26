"use client"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-6">
      <h1 className="text-3xl font-bold">AI Bookkeeper</h1>
      <p className="text-gray-600">Your automated business finance assistant</p>

      <div className="space-x-4">
        <button
          onClick={() => router.push("/auth/login")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/auth/signup")}
          className="border px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}
