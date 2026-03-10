"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

export default function Pricing() {

  const router = useRouter()
  const [billing,setBilling] = useState("monthly")

  const essentialPrice = billing === "monthly" ? "$5" : "$48"
  const plusPrice = billing === "monthly" ? "$7.99" : "$79"

  return (

    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white py-32 px-6">

      {/* SOFT BACKGROUND GLOW */}

      <div className="absolute left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-200 blur-3xl opacity-30"></div>

      <div className="relative max-w-6xl mx-auto text-center">

        {/* TITLE */}

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Simple pricing
        </h1>

        <p className="text-gray-600 mb-12 text-lg">
          Start free. Upgrade as your business grows.
        </p>


        {/* BILLING SWITCH */}

        <div className="flex justify-center mb-16">

          <div className="flex bg-gray-100 rounded-full p-1">

            <button
              onClick={()=>setBilling("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                billing==="monthly"
                ? "bg-red-600 text-white shadow"
                : "text-gray-600"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={()=>setBilling("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                billing==="yearly"
                ? "bg-red-600 text-white shadow"
                : "text-gray-600"
              }`}
            >
              Yearly
            </button>

          </div>

        </div>


        {/* PRICING GRID */}

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">


          {/* ESSENTIAL */}

          <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">

            <h2 className="text-2xl font-bold mb-4">
              Essential
            </h2>

            <p className="text-5xl font-bold mb-8">
              {essentialPrice}
              <span className="text-sm text-gray-500 ml-2">
                /{billing === "monthly" ? "mo" : "yr"}
              </span>
            </p>

            <ul className="space-y-3 text-gray-600 mb-10 text-sm">

              <Feature text="AI expense tracking" />
              <Feature text="Financial insights" />
              <Feature text="Basic dashboards" />

            </ul>

            <button
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Get Started
            </button>

          </div>


          {/* PLUS */}

          <div className="relative bg-white border-2 border-red-600 rounded-3xl p-10 shadow-xl hover:-translate-y-1 transition">

            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-4 py-1 rounded-full">
              Most Popular
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Plus+
            </h2>

            <p className="text-5xl font-bold mb-8">
              {plusPrice}
              <span className="text-sm text-gray-500 ml-2">
                /{billing === "monthly" ? "mo" : "yr"}
              </span>
            </p>

            <ul className="space-y-3 text-gray-600 mb-10 text-sm">

              <Feature text="Everything in Essential" />
              <Feature text="Advanced analytics" />
              <Feature text="Priority AI insights" />
              <Feature text="Faster financial reports" />

            </ul>

            <button
              className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
            >
              Upgrade to Plus
            </button>

          </div>

        </div>


        {/* BACK BUTTON */}

        <button
          onClick={()=>router.push("/")}
          className="text-gray-500 mt-20 hover:text-red-600 transition"
        >
          ← Back
        </button>

      </div>

    </div>

  )
}


/* FEATURE ITEM */

function Feature({ text }: { text:string }) {

  return (

    <li className="flex items-center gap-2">

      <Check className="text-red-600 w-4 h-4" />

      {text}

    </li>

  )

}