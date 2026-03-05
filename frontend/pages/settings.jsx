"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import api from "@/lib/api"

export default function Settings() {

  const router = useRouter()

  const [profile,setProfile] = useState({
    email:"",
    businessName:"",
    currency:"USD"
  })

  const [password,setPassword] = useState({
    current:"",
    new:"",
    confirm:""
  })

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    router.push("/auth/login")
  }

  const deleteAccount = async () => {

    if(!confirm("Delete your account permanently?")) return

    await api.delete("/api/user/delete")

    localStorage.removeItem("token")
    localStorage.removeItem("userId")

    router.push("/auth/signup")
  }

  return (
    <div className="max-w-2xl space-y-10">

      {/* PROFILE */}

      <div className="bg-white p-10 rounded-2xl border shadow-sm space-y-6">

        <h2 className="text-xl font-semibold">
          Profile
        </h2>

        <input
          placeholder="Email"
          value={profile.email}
          disabled
          className="w-full border p-3 rounded"
        />

        <input
          placeholder="Business Name"
          value={profile.businessName}
          onChange={(e)=>setProfile({...profile,businessName:e.target.value})}
          className="w-full border p-3 rounded"
        />

        <select
          value={profile.currency}
          onChange={(e)=>setProfile({...profile,currency:e.target.value})}
          className="w-full border p-3 rounded"
        >
          <option>USD</option>
          <option>EUR</option>
          <option>GBP</option>
        </select>

        <button className="bg-red-500 text-white px-6 py-3 rounded-xl">
          Save Profile
        </button>

      </div>

      {/* PASSWORD */}

      <div className="bg-white p-10 rounded-2xl border shadow-sm space-y-6">

        <h2 className="text-xl font-semibold">
          Security
        </h2>

        <input
          type="password"
          placeholder="Current Password"
          value={password.current}
          onChange={(e)=>setPassword({...password,current:e.target.value})}
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="New Password"
          value={password.new}
          onChange={(e)=>setPassword({...password,new:e.target.value})}
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={password.confirm}
          onChange={(e)=>setPassword({...password,confirm:e.target.value})}
          className="w-full border p-3 rounded"
        />

        <button className="bg-black text-white px-6 py-3 rounded-xl">
          Update Password
        </button>

      </div>

      {/* ACCOUNT */}

      <div className="bg-white p-10 rounded-2xl border shadow-sm">

        <h2 className="text-xl font-semibold mb-6">
          Account
        </h2>

        <button
          onClick={logout}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Log Out
        </button>

      </div>

      {/* DANGER */}

      <div className="bg-white p-10 rounded-2xl border border-red-200 shadow-sm">

        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Danger Zone
        </h2>

        <button
          onClick={deleteAccount}
          className="bg-red-500 text-white px-6 py-3 rounded-xl"
        >
          Delete Account
        </button>

      </div>

    </div>
  )
}