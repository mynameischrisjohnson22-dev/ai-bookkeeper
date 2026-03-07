"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import api from "@/lib/api"

export default function Settings() {

  const router = useRouter()

  const [loading,setLoading] = useState(false)

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

//////////////////////////////////////////////////////
// LOAD PROFILE
//////////////////////////////////////////////////////

  const loadProfile = async () => {

    try {

      const { data } = await api.get("/api/user/profile")

      setProfile({
        email: data.email,
        businessName: data.businessName ?? "",
        currency: data.currency ?? "USD"
      })

    } catch (err) {

      console.error(err)
      toast.error("Failed to load profile")

    }

  }

  useEffect(()=>{
    loadProfile()
  },[])

//////////////////////////////////////////////////////
// SAVE PROFILE
//////////////////////////////////////////////////////

  const saveProfile = async () => {

    try {

      setLoading(true)

      const { data } = await api.patch("/api/user/profile",{
        businessName: profile.businessName,
        currency: profile.currency
      })

      setProfile({
        email: data.email,
        businessName: data.businessName ?? "",
        currency: data.currency ?? "USD"
      })

      toast.success("Profile updated")

    } catch (err) {

      console.error(err)
      toast.error("Failed to update profile")

    } finally {

      setLoading(false)

    }

  }

//////////////////////////////////////////////////////
// UPDATE PASSWORD
//////////////////////////////////////////////////////

  const updatePassword = async () => {

    if(password.new !== password.confirm){
      toast.error("Passwords do not match")
      return
    }

    try {

      setLoading(true)

      await api.patch("/api/user/password",{
        currentPassword: password.current,
        newPassword: password.new
      })

      setPassword({
        current:"",
        new:"",
        confirm:""
      })

      toast.success("Password updated")

    } catch (err) {

      console.error(err)
      toast.error("Failed to update password")

    } finally {

      setLoading(false)

    }

  }

//////////////////////////////////////////////////////
// LOGOUT
//////////////////////////////////////////////////////

  const logout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("userId")

    router.push("/auth/login")

  }

//////////////////////////////////////////////////////
// DELETE ACCOUNT
//////////////////////////////////////////////////////

  const deleteAccount = async () => {

    const confirmDelete = prompt("Type DELETE to confirm")

    if(confirmDelete !== "DELETE") return

    try {

      await api.delete("/api/user/account")

      localStorage.removeItem("token")
      localStorage.removeItem("userId")

      router.push("/auth/signup")

    } catch (err) {

      console.error(err)
      toast.error("Failed to delete account")

    }

  }

//////////////////////////////////////////////////////

  return (

    <div className="max-w-4xl mx-auto py-12 space-y-12">

      <h1 className="text-3xl font-bold">
        Settings
      </h1>

{/* PROFILE */}

      <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">

        <div>
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-slate-500">
            Manage your account information and preferences.
          </p>
        </div>

        <input
          value={profile.email}
          disabled
          className="w-full border border-slate-300 rounded-lg p-3 bg-slate-100"
        />

        <input
          placeholder="Business Name"
          value={profile.businessName}
          onChange={(e)=>setProfile({...profile,businessName:e.target.value})}
          className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none"
        />

        <select
          value={profile.currency}
          onChange={(e)=>setProfile({...profile,currency:e.target.value})}
          className="w-full border border-slate-300 rounded-lg p-3"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="CAD">CAD</option>
        </select>

        <button
          onClick={saveProfile}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

      </section>

{/* SECURITY */}

      <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">

        <div>
          <h2 className="text-xl font-semibold">Security</h2>
          <p className="text-sm text-slate-500">
            Update your password and secure your account.
          </p>
        </div>

        <input
          type="password"
          placeholder="Current Password"
          value={password.current}
          onChange={(e)=>setPassword({...password,current:e.target.value})}
          className="w-full border border-slate-300 rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="New Password"
          value={password.new}
          onChange={(e)=>setPassword({...password,new:e.target.value})}
          className="w-full border border-slate-300 rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={password.confirm}
          onChange={(e)=>setPassword({...password,confirm:e.target.value})}
          className="w-full border border-slate-300 rounded-lg p-3"
        />

        <button
          onClick={updatePassword}
          disabled={loading}
          className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

      </section>

{/* ACCOUNT */}

      <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

        <h2 className="text-xl font-semibold mb-6">
          Account
        </h2>

        <button
          onClick={logout}
          className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
        >
          Log Out
        </button>

      </section>

{/* DANGER ZONE */}

      <section className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-sm space-y-4">

        <h2 className="text-lg font-semibold text-red-600">
          Danger Zone
        </h2>

        <p className="text-sm text-red-500">
          Deleting your account permanently removes all financial data.
        </p>

        <button
          onClick={deleteAccount}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
        >
          Delete Account
        </button>

      </section>

    </div>

  )

}
<section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

  <h2 className="text-xl font-semibold mb-6">
    Active Sessions
  </h2>

  <div className="space-y-4">

    <div className="border rounded-lg p-4">
      <p className="font-medium">Windows • Chrome</p>
      <p className="text-sm text-slate-500">Last active: 2 minutes ago</p>
    </div>

    <div className="border rounded-lg p-4">
      <p className="font-medium">iPhone • Safari</p>
      <p className="text-sm text-slate-500">Last active: Yesterday</p>
    </div>

  </div>

</section>