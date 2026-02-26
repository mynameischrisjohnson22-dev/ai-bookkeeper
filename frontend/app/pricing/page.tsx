"use client"

import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"

const API = "http://localhost:4000"
const USER_ID = "demo123" // temp until auth

export default function PricingPage() {
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const checkout = async (planId: string) => {
    try {
      setLoadingPlan(planId)

      const res = await axios.post(`${API}/stripe/checkout`, {
        planId,
        userId: USER_ID
      })

      window.location.href = res.data.url
    } catch (err) {
      console.error("Stripe checkout failed:", err)
      alert("Stripe checkout failed")
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full space-y-8">

        <h1 className="text-4xl font-bold text-center">
          Upgrade Your Plan
        </h1>

        <p className="text-center text-gray-600">
          Choose the plan that fits your financial goals
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* BASIC MONTHLY */}
          <PlanCard
            title="Basic"
            price="$9 / mo"
            features={[
              "CSV uploads",
              "Basic reports",
              "Manual categories"
            ]}
            loading={loadingPlan === "basic_monthly"}
            onClick={() => checkout("basic_monthly")}
            buttonText="Get Basic Monthly"
          />

          {/* BASIC YEARLY */}
          <PlanCard
            title="Basic (Yearly)"
            price="$90 / yr"
            features={[
              "CSV uploads",
              "Basic reports",
              "Manual categories",
              "2 months free"
            ]}
            loading={loadingPlan === "basic_yearly"}
            onClick={() => checkout("basic_yearly")}
            buttonText="Get Basic Yearly"
          />

          {/* PRO MONTHLY */}
          <PlanCard
            title="Pro"
            price="$19 / mo"
            highlight
            features={[
              "Everything in Basic",
              "AI categorization",
              "AI chat assistant",
              "Advanced reports"
            ]}
            loading={loadingPlan === "pro_monthly"}
            onClick={() => checkout("pro_monthly")}
            buttonText="Get Pro Monthly"
          />

          {/* PRO YEARLY */}
          <PlanCard
            title="Pro (Yearly)"
            price="$190 / yr"
            highlight
            features={[
              "Everything in Pro",
              "Priority AI",
              "2 months free"
            ]}
            loading={loadingPlan === "pro_yearly"}
            onClick={() => checkout("pro_yearly")}
            buttonText="Get Pro Yearly"
          />

        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-gray-600 hover:text-black underline"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  )
}

type PlanProps = {
  title: string
  price: string
  features: string[]
  onClick: () => void
  loading: boolean
  buttonText: string
  highlight?: boolean
}

function PlanCard({
  title,
  price,
  features,
  onClick,
  loading,
  buttonText,
  highlight
}: PlanProps) {
  return (
    <div
      className={`border rounded-xl p-6 flex flex-col justify-between shadow ${
        highlight ? "border-green-500 bg-green-50" : "bg-white"
      }`}
    >
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className="text-3xl font-extrabold mb-4">{price}</div>

        <ul className="space-y-2 text-gray-700 mb-6">
          {features.map((f, i) => (
            <li key={i}>✔ {f}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={onClick}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          highlight
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-800 hover:bg-gray-900"
        } disabled:opacity-50`}
      >
        {loading ? "Redirecting..." : buttonText}
      </button>
    </div>
  )
}
