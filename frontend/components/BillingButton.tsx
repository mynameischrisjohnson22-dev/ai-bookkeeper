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

      // Extract checkout URL safely
      const checkoutUrl: string | undefined =
        res?.data?.url ??
        res?.data?.checkoutUrl ??
        res?.data?.checkout_url ??
        res?.data?.checkout?.url ??
        res?.data?.data?.checkout?.url ??
        (Object.values(res.data || {}).find(v => typeof v === "string") as string)

      if (!checkoutUrl) {
        console.error("Checkout URL missing:", res.data)
        alert("Checkout failed. Please try again.")
        return
      }

      // Redirect to Paddle checkout
      window.location.href = checkoutUrl

    } catch (error) {

      console.error("Upgrade error:", error)
      alert("Unable to start checkout. Please try again.")

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
          onClick={() => upgrade("essential")}
          disabled={loading !== null}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading === "essential" ? "Loading..." : "Essential Plan"}
        </button>

        <button
          onClick={() => upgrade("plus")}
          disabled={loading !== null}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading === "plus" ? "Loading..." : "Plus Plan"}
        </button>

      </div>

    </div>

  )

}