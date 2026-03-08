"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const checkout = async (plan: string, billing: string) => {
    try {
      const key = `${plan}-${billing}`
      setLoading(key)

      const res = await api.post("/api/billing/checkout", {
        plan,
        billing
      })

      window.location.href = res.data.url

    } catch (err) {
      console.error("Checkout failed:", err)
      alert("Checkout failed")
      setLoading(null)
    }
  }

  const plans = [
    {
      name: "Essential",
      description: "Perfect for freelancers",
      prices: {
        monthly: "$9/mo",
        yearly: "$90/yr",
        lifetime: "$199"
      },
      features: [
        "Expense Tracking",
        "Basic Reports",
        "AI Categorization"
      ]
    },
    {
      name: "Plus",
      description: "Best for growing businesses",
      prices: {
        monthly: "$29/mo",
        yearly: "$290/yr",
        lifetime: "$599"
      },
      features: [
        "Everything in Essential",
        "Advanced AI Insights",
        "Unlimited Transactions",
        "Priority Support"
      ]
    }
  ]

  return (
    <div className="bg-[#020b1f] text-white min-h-screen p-10">

      <h1 className="text-3xl font-bold mb-10">
        Upgrade Your Plan
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        {plans.map((plan) => (

          <div
            key={plan.name}
            className="bg-[#0f1a33] p-8 rounded-2xl shadow-xl"
          >

            <h2 className="text-2xl font-bold mb-2">
              {plan.name}
            </h2>

            <p className="text-gray-400 mb-6">
              {plan.description}
            </p>

            <ul className="space-y-2 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="text-gray-300">
                  • {f}
                </li>
              ))}
            </ul>

            <div className="space-y-3">

              <button
                onClick={() => checkout(plan.name.toLowerCase(), "monthly")}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg font-semibold"
              >
                {loading === `${plan.name.toLowerCase()}-monthly`
                  ? "Loading..."
                  : `Monthly — ${plan.prices.monthly}`}
              </button>

              <button
                onClick={() => checkout(plan.name.toLowerCase(), "yearly")}
                className="w-full border border-gray-600 py-3 rounded-lg"
              >
                {loading === `${plan.name.toLowerCase()}-yearly`
                  ? "Loading..."
                  : `Yearly — ${plan.prices.yearly}`}
              </button>

              <button
                onClick={() => checkout(plan.name.toLowerCase(), "lifetime")}
                className="w-full border border-yellow-500 text-yellow-400 py-3 rounded-lg"
              >
                {loading === `${plan.name.toLowerCase()}-lifetime`
                  ? "Loading..."
                  : `Lifetime — ${plan.prices.lifetime}`}
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}