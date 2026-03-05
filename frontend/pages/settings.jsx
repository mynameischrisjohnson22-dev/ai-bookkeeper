"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import api from "@/lib/api"

export default function Settings() {

  const router = useRouter()

  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")

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
      console.error("Failed to load profile",err)
    }

  }

  //////////////////////////////////////////////////////
  // SAVE PROFILE
  //////////////////////////////////////////////////////

  const saveProfile = async () => {

    try{

      setLoading(true)
      setError("")

      await api.patch("/api/user/profile",{
        businessName:profile.businessName,
        currency:profile.currency
      })

    }catch(err){

      setError("Failed to update profile")

    }finally{

      setLoading(false)

    }

  }

  //////////////////////////////////////////////////////
  // UPDATE PASSWORD
  //////////////////////////////////////////////////////

  const updatePassword = async () => {

    if(password.new !== password.confirm){
      setError("Passwords do not match")
      return
    }

    try{

      setLoading(true)
      setError("")

      await api.patch("/api/user/password",{
        currentPassword:password.current,
        newPassword:password.new
      })

      setPassword({
        current:"",
        new:"",
        confirm:""
      })

    }catch(err){

      setError("Failed to update password")

    }finally{

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

    const confirmed = confirm("Delete your account permanently?")

    if(!confirmed) return

    try{

      await api.delete("/api/user/delete")

      localStorage.removeItem("token")
      localStorage.removeItem("userId")

      router.push("/auth/signup")

    }catch(err){

      setError("Failed to delete account")

    }

  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="max-w-2xl space-y-10">

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* PROFILE */}

      <div className="bg-white p-10 rounded-2xl border shadow-sm space-y-6">

        <h2 className="text-xl font-semibold">
          Profile
        </h2>

        <input
          value={profile.email}
          disabled
          className="w-full border p-3 rounded bg-slate-100"
        />

        <input
          placeholder="Business Name"
          value={profile.businessName}
          onChange={(e)=>
            setProfile({...profile,businessName:e.target.value})
          }
          className="w-full border p-3 rounded"
        />

        <select
          value={profile.currency}
          onChange={(e)=>
            setProfile({...profile,currency:e.target.value})
          }
          className="w-full border p-3 rounded"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="CAD">CAD</option>
        </select>

        <button
          onClick={saveProfile}
          disabled={loading}
          className="bg-red-500 text-white px-6 py-3 rounded-xl"
        >
          Save Profile
        </button>

      </div>

      {/* SECURITY */}

      <div className="bg-white p-10 rounded-2xl border shadow-sm space-y-6">

        <h2 className="text-xl font-semibold">
          Security
        </h2>

        <input
          type="password"
          placeholder="Current Password"
          value={password.current}
          onChange={(e)=>
            setPassword({...password,current:e.target.value})
          }
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="New Password"
          value={password.new}
          onChange={(e)=>
            setPassword({...password,new:e.target.value})
          }
          className="w-full border p-3 rounded"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={password.confirm}
          onChange={(e)=>
            setPassword({...password,confirm:e.target.value})
          }
          className="w-full border p-3 rounded"
        />

        <button
          onClick={updatePassword}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
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

      {/* DANGER ZONE */}

      <div className="bg-white p-10 rounded-2xl border border-red-200 shadow-sm">

        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Danger Zone
        </h2>

        <p className="text-sm text-slate-500 mb-6">
          Deleting your account will permanently remove all data.
        </p>

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