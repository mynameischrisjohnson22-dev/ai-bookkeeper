"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function Billing() {

  const [plan,setPlan] = useState("basic")
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    loadPlan()
  },[])

  const loadPlan = async () => {

    try{

      const res = await api.get("/api/billing/plan")

      setPlan(res.data.plan)

    }catch(err){
      console.error(err)
    }

  }

  const upgrade = async () => {

    try{

      setLoading(true)

      const res = await api.post("/api/billing/checkout")

      window.location.href = res.data.url

    }catch(err){
      console.error(err)
    }

  }

  const openPortal = async () => {

    try{

      const res = await api.post("/api/billing/portal")

      window.location.href = res.data.url

    }catch(err){
      console.error(err)
    }

  }

  return (
    <div className="max-w-2xl space-y-8">

      <div className="bg-white p-10 rounded-2xl border shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          Current Plan
        </h2>

        <p className="text-slate-600 mb-6">
          {plan === "pro" ? "Pro Plan" : "Basic Plan"}
        </p>

        {plan === "basic" && (
          <button
            onClick={upgrade}
            disabled={loading}
            className="bg-red-500 text-white px-6 py-3 rounded-xl"
          >
            Upgrade to Pro
          </button>
        )}

      </div>

      <div className="bg-white p-10 rounded-2xl border shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          Subscription
        </h2>

        <button
          onClick={openPortal}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Manage Billing
        </button>

      </div>

    </div>
  )
}