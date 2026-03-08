"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function PricingPage() {

  const router = useRouter()

  const [billing, setBilling] = useState("monthly")
  const [loading, setLoading] = useState<string | null>(null)

  const plans = [
    {
      name: "essential",
      title: "Essential",
      monthly: 5,
      yearly: 47,
      lifetime: 79
    },
    {
      name: "plus",
      title: "Plus+",
      monthly: 7.99,
      yearly: 55,
      lifetime: 100
    }
  ]

  const checkout = async (plan: string) => {

    try {

      setLoading(plan)

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

  return (

    <div className="min-h-screen flex flex-col items-center justify-center gap-10">

      <h1 className="text-4xl font-bold">Choose your plan</h1>

      {/* Billing Toggle */}

      <div className="flex gap-4">

        <button
          onClick={() => setBilling("monthly")}
          className={billing === "monthly" ? "font-bold" : ""}
        >
          Monthly
        </button>

        <button
          onClick={() => setBilling("yearly")}
          className={billing === "yearly" ? "font-bold" : ""}
        >
          Yearly
        </button>

        <button
          onClick={() => setBilling("lifetime")}
          className={billing === "lifetime" ? "font-bold" : ""}
        >
          Lifetime
        </button>

      </div>

      {/* Plans */}

      <div className="flex gap-10">

        {plans.map((plan) => {

          const price =
            billing === "monthly"
              ? plan.monthly
              : billing === "yearly"
              ? plan.yearly
              : plan.lifetime

          return (

            <div
              key={plan.name}
              className="border p-6 rounded-lg w-64 text-center"
            >

              <h2 className="text-2xl font-semibold">{plan.title}</h2>

              <p className="text-3xl font-bold mt-4">
                ${price}
              </p>

              <button
                onClick={() => checkout(plan.name)}
                disabled={loading === plan.name}
                className="mt-6 bg-black text-white px-6 py-2 rounded"
              >
                {loading === plan.name ? "Redirecting..." : "Subscribe"}
              </button>

            </div>

          )
        })}

      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="underline"
      >
        Back
      </button>

    </div>

  )
}