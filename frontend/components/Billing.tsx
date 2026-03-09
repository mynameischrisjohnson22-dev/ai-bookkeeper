"use client"

import { useState } from "react"
import api from "@/lib/api"

type Plan = "essential" | "plus"
type BillingCycle = "monthly" | "yearly" | "lifetime"

export default function Billing() {

  const [billing, setBilling] = useState<BillingCycle>("monthly")
  const [loading, setLoading] = useState<Plan | null>(null)

  const upgrade = async (plan: Plan) => {

    try {

      setLoading(plan)

      const res = await api.post("/api/billing/checkout", {
        plan,
        billing
      })

      console.log("Checkout response:", res.data)

      const checkoutUrl: string | undefined =
        res.data?.url ??
        res.data?.checkoutUrl ??
        res.data?.checkout_url ??
        res.data?.checkout?.url ??
        res.data?.data?.checkout?.url ??
        Object.values(res.data || {})[0]

      if (!checkoutUrl) {
        console.error("Checkout URL missing:", res.data)
        alert("Checkout failed. Please try again.")
        return
      }

      window.location.href = checkoutUrl

    } catch (err) {

      console.error("Upgrade error:", err)
      alert("Something went wrong starting checkout.")

    } finally {

      setLoading(null)

    }

  }

  const prices = {
    essential: { monthly: 5, yearly: 47, lifetime: 79 },
    plus: { monthly: 7.99, yearly: 55, lifetime: 100 }
  }

  return (

    <div className="max-w-5xl space-y-10">

      <div>
        <h2 className="text-2xl font-bold">
          Billing
        </h2>

        <p className="text-slate-500">
          Upgrade your Albdy plan
        </p>
      </div>

      {/* Billing Toggle */}

      <div className="flex gap-3 bg-white border rounded-xl p-2 w-fit">

        {["monthly","yearly","lifetime"].map(type => (

          <button
            key={type}
            onClick={() => setBilling(type as BillingCycle)}
            className={`px-4 py-2 rounded-lg text-sm ${
              billing === type
                ? "bg-red-500 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>

        ))}

      </div>

      {/* Plans */}

      <div className="grid md:grid-cols-2 gap-8">

        {/* Essential */}

        <div className="bg-white p-10 rounded-2xl border shadow-sm">

          <h3 className="text-lg font-semibold mb-2">
            Essential
          </h3>

          <div className="text-3xl font-bold mb-4">
            ${prices.essential[billing]}

            {billing !== "lifetime" && (
              <span className="text-sm text-slate-500">
                /{billing === "monthly" ? "month" : "year"}
              </span>
            )}

          </div>

          <button
            onClick={() => upgrade("essential")}
            disabled={loading !== null}
            className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600"
          >
            {loading === "essential" ? "Loading..." : "Choose Essential"}
          </button>

        </div>

        {/* Plus */}

        <div className="bg-white p-10 rounded-2xl border shadow-sm">

          <h3 className="text-lg font-semibold mb-2">
            Plus+
          </h3>

          <div className="text-3xl font-bold mb-4">
            ${prices.plus[billing]}

            {billing !== "lifetime" && (
              <span className="text-sm text-slate-500">
                /{billing === "monthly" ? "month" : "year"}
              </span>
            )}

          </div>

          <button
            onClick={() => upgrade("plus")}
            disabled={loading !== null}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
          >
            {loading === "plus" ? "Loading..." : "Choose Plus+"}
          </button>

        </div>

      </div>

    </div>

  )

}