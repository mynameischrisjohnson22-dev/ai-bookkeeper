"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const API = "http://localhost:4000"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async () => {
    if (!email || !password) {
      alert("Enter email and password")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password
      })

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userId", res.data.user.id)

      router.push("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message)
      alert(err.response?.data?.error || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>

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
        onClick={login}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  )
}
