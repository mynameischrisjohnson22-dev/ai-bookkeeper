"use client"

import { useState } from "react"

export default function BillingPage() {
  const [dark, setDark] = useState(true)

  const plans = [
    { name: "Starter", price: "$9/month", features: ["Basic Tracking", "Manual Entries"] },
    { name: "Pro", price: "$29/month", features: ["AI Insights", "Unlimited Transactions"] },
    { name: "Business", price: "$59/month", features: ["Multi-User", "Advanced Reports"] }
  ]

  return (
    <div className={`${dark ? "bg-[#020b1f] text-white" : "bg-white text-black"} min-h-screen p-10`}>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Billing</h1>
        <button
          onClick={() => setDark(!dark)}
          className="border px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Toggle Dark Mode
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-[#0f1a33] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-purple-400 text-xl mb-4">{plan.price}</p>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="text-gray-300">
                  • {feature}
                </li>
              ))}
            </ul>

            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg font-semibold">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
