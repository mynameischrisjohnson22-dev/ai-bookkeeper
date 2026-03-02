"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function PricingPage() {
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const checkout = async (planId: string) => {
    try {
      setLoadingPlan(planId)

      const res = await api.post("/api/stripe/checkout", {
        planId,
      })

      window.location.href = res.data.url
    } catch (err) {
      console.error("Stripe checkout failed:", err)
      alert("Stripe checkout failed")
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Upgrade Plan</h1>

        <button
          onClick={() => checkout("basic_monthly")}
          disabled={loadingPlan === "basic_monthly"}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {loadingPlan === "basic_monthly"
            ? "Redirecting..."
            : "Buy Basic Monthly"}
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="underline"
        >
          Back
        </button>
      </div>
    </div>
  )
}