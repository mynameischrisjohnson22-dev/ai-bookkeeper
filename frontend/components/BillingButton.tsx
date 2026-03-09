"use client"

import { useState } from "react"
import api from "@/lib/api"

type Plan = "essential" | "plus"

export default function BillingButton() {

  const [loading, setLoading] = useState<Plan | null>(null)

  const upgrade = async (plan: Plan) => {

    try {

      setLoading(plan)

      const res = await api.post("/api/billing/checkout", {
        plan,
        billing: "monthly"
      })

      console.log("Checkout response:", res.data)

      const checkoutUrl: string | undefined =
        res.data?.url ??
        res.data?.checkoutUrl ??
        res.data?.checkout_url ??
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

  return (

    <div className="mt-6 p-6 border rounded-xl bg-white shadow-sm max-w-md">

      <h3 className="text-lg font-semibold mb-4">
        Upgrade Plan
      </h3>

      <div className="flex gap-3">

        <button
          disabled={loading !== null}
          onClick={() => upgrade("essential")}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          {loading === "essential" ? "Loading..." : "Essential Plan"}
        </button>

        <button
          disabled={loading !== null}
          onClick={() => upgrade("plus")}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
        >
          {loading === "plus" ? "Loading..." : "Plus Plan"}
        </button>

      </div>

    </div>

  )

}