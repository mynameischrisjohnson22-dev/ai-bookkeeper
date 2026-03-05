"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import api from "@/lib/api"

export default function Settings() {

  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")

    router.push("/auth/login")
    router.refresh()
  }

  /* ================= DELETE ACCOUNT ================= */

  const deleteAccount = async () => {

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?"
    )

    if (!confirmed) return

    try {

      setLoading(true)
      setError("")

      await api.delete("/api/user/delete")

      localStorage.removeItem("token")
      localStorage.removeItem("userId")

      router.push("/auth/signup")

    } catch (err) {

      console.error("Delete account error:", err)
      setError("Failed to delete account")

    } finally {

      setLoading(false)

    }
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-2xl space-y-10">

      {/* ACCOUNT */}
      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">

        <h2 className="text-xl font-semibold mb-6">
          Account
        </h2>

        <button
          onClick={logout}
          className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
        >
          Log Out
        </button>

      </div>

      {/* DANGER ZONE */}
      <div className="bg-white p-10 rounded-2xl border border-red-200 shadow-sm">

        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Danger Zone
        </h2>

        <p className="text-sm text-slate-500 mb-6">
          Deleting your account will permanently remove all your business data.
        </p>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={deleteAccount}
          disabled={loading}
          className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 disabled:opacity-50 transition"
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>

      </div>

    </div>
  )
}