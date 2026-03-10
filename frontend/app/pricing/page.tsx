"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Pricing() {

  const router = useRouter()
  const [billing,setBilling] = useState("monthly")

  return (

    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white py-32 px-6">

      <div className="max-w-6xl mx-auto text-center">

        <h1 className="text-5xl font-bold mb-6">
          Choose your plan
        </h1>

        <p className="text-gray-600 mb-10">
          Start free and scale as your business grows
        </p>

        {/* BILLING TOGGLE */}

        <div className="flex justify-center gap-6 mb-16">

          <button
            onClick={()=>setBilling("monthly")}
            className={`px-4 py-2 rounded-lg ${
              billing==="monthly"
              ? "bg-red-600 text-white"
              : "text-gray-600"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={()=>setBilling("yearly")}
            className={`px-4 py-2 rounded-lg ${
              billing==="yearly"
              ? "bg-red-600 text-white"
              : "text-gray-600"
            }`}
          >
            Yearly
          </button>

        </div>

        {/* PRICING CARDS */}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* ESSENTIAL */}

          <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">

            <h2 className="text-2xl font-bold mb-4">
              Essential
            </h2>

            <p className="text-4xl font-bold mb-6">
              $5
            </p>

            <ul className="text-gray-600 space-y-2 mb-8 text-sm">

              <li>AI expense tracking</li>
              <li>Financial insights</li>
              <li>Basic dashboards</li>

            </ul>

            <button
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Subscribe
            </button>

          </div>


          {/* PLUS PLAN */}

          <div className="bg-white border-2 border-red-600 rounded-2xl p-10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition relative">

            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
              Most Popular
            </div>

            <h2 className="text-2xl font-bold mb-4">
              Plus+
            </h2>

            <p className="text-4xl font-bold mb-6">
              $7.99
            </p>

            <ul className="text-gray-600 space-y-2 mb-8 text-sm">

              <li>Everything in Essential</li>
              <li>Advanced analytics</li>
              <li>Priority AI insights</li>

            </ul>

            <button
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
            >
              Subscribe
            </button>

          </div>

        </div>

        <button
          onClick={()=>router.push("/")}
          className="text-gray-500 mt-16 hover:text-red-600"
        >
          ← Back
        </button>

      </div>

    </div>

  )
}