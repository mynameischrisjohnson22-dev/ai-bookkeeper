"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const API = "http://localhost:4000"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const signup = async () => {
    if (!email || !password) {
      alert("Email and password required")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(`${API}/auth/signup`, {
        email,
        password,
      })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userId", res.data.user.id)

      router.push("/dashboard")
    } catch (err: any) {
      console.error("Signup error:", err)
      alert(err.response?.data?.error || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto space-y-3">
      <h1 className="text-xl font-bold">Sign Up</h1>

      <input
        className="border p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        className="bg-black text-white px-4 py-2 w-full rounded disabled:opacity-50"
        onClick={signup}
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </div>
  )
}

