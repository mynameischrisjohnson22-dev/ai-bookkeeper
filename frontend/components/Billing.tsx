"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

export default function Billing() {

  const [plan,setPlan] = useState("basic")
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    loadPlan()
  }, [])

  const loadPlan = async () => {
    try{
      const res = await api.get("/api/billing/plan")
      setPlan(res.data.plan)
    }catch(err){
      console.error(err)
    }
  }

  const openPortal = async () => {
    try{
      setLoading(true)

      const res = await api.post("/api/billing/portal")

      window.location.href = res.data.url
    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-10">

      {/* PLAN */}
      <div className="bg-white p-10 rounded-2xl border shadow-sm">

        <h2 className="text-xl font-semibold mb-6">
          Current Plan
        </h2>

        <div className="text-2xl font-bold text-red-500 mb-6">
          {plan === "pro" ? "Pro Plan" : "Basic Plan"}
        </div>

        {plan === "basic" && (
          <button
            onClick={openPortal}
            className="bg-red-500 text-white px-6 py-3 rounded-xl"
          >
            Upgrade to Pro
          </button>
        )}

        {plan === "pro" && (
          <button
            onClick={openPortal}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Manage Subscription
          </button>
        )}

      </div>

      {/* BILLING PORTAL */}

      <div className="bg-white p-10 rounded-2xl border shadow-sm">

        <h2 className="text-xl font-semibold mb-6">
          Billing Portal
        </h2>

        <p className="text-slate-500 mb-6">
          Manage invoices, payment methods, and cancel your subscription.
        </p>

        <button
          onClick={openPortal}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          {loading ? "Opening..." : "Open Billing Portal"}
        </button>

      </div>

    </div>
  )
}