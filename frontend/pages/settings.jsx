"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
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

  useEffect(()=>{
    loadProfile()
  },[])

  const loadProfile = async () => {

    try{

      const res = await api.get("/api/user/profile")

      setProfile({
        email:res.data.email,
        businessName:res.data.businessName || "",
        currency:res.data.currency || "USD"
      })

    }catch(err){
      toast.error("Failed to load profile")
    }

  }

  //////////////////////////////////////////////////////

  const saveProfile = async () => {

    try{

      setLoading(true)

      await api.patch("/api/user/profile",{
        businessName:profile.businessName,
        currency:profile.currency
      })

      toast.success("Profile updated")

    }catch(err){

      toast.error("Failed to update profile")

    }finally{

      setLoading(false)

    }

  }

  //////////////////////////////////////////////////////

  const updatePassword = async () => {

    if(password.new !== password.confirm){
      toast.error("Passwords do not match")
      return
    }

    try{

      setLoading(true)

      await api.patch("/api/user/password",{
        currentPassword:password.current,
        newPassword:password.new
      })

      setPassword({
        current:"",
        new:"",
        confirm:""
      })

      toast.success("Password updated")

    }catch(err){

      toast.error("Failed to update password")

    }finally{

      setLoading(false)

    }

  }

  //////////////////////////////////////////////////////

  const logout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("userId")

    router.push("/auth/login")

  }

  //////////////////////////////////////////////////////

  const deleteAccount = async () => {

    const confirmDelete = prompt("Type DELETE to confirm")

    if(confirmDelete !== "DELETE") return

    try{

      await api.delete("/api/user/delete")

      localStorage.removeItem("token")
      localStorage.removeItem("userId")

      router.push("/auth/signup")

    }catch(err){

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

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">

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
          onChange={(e)=>
            setProfile({...profile,businessName:e.target.value})
          }
          className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-red-400 outline-none"
        />

        <select
          value={profile.currency}
          onChange={(e)=>
            setProfile({...profile,currency:e.target.value})
          }
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

      </div>

      {/* SECURITY */}

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">

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
          onChange={(e)=>
            setPassword({...password,current:e.target.value})
          }
          className="w-full border border-slate-300 rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="New Password"
          value={password.new}
          onChange={(e)=>
            setPassword({...password,new:e.target.value})
          }
          className="w-full border border-slate-300 rounded-lg p-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={password.confirm}
          onChange={(e)=>
            setPassword({...password,confirm:e.target.value})
          }
          className="w-full border border-slate-300 rounded-lg p-3"
        />

        <button
          onClick={updatePassword}
          disabled={loading}
          className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

      </div>

      {/* ACCOUNT */}

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">

        <h2 className="text-xl font-semibold mb-6">
          Account
        </h2>

        <button
          onClick={logout}
          className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
        >
          Log Out
        </button>

      </div>

      {/* DANGER ZONE */}

      <div className="bg-red-50 rounded-2xl border border-red-200 p-8 shadow-sm space-y-4">

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

      </div>

    </div>

  )

}