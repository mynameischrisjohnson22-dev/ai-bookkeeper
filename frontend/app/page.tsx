"use client"

import { useRouter } from "next/navigation"
import { Brain, Receipt, BarChart3, ShieldCheck } from "lucide-react"
import React from "react"

export default function Home() {

  const router = useRouter()

  return (
    <div className="min-h-screen bg-white text-black">

      {/* HERO */}

      <section className="relative overflow-hidden text-center py-44 px-6 bg-gradient-to-b from-white via-red-50/70 to-white">

        <div className="absolute left-1/2 -translate-x-1/2 top-16 w-[1000px] h-[420px] bg-red-300/40 blur-[120px] opacity-50"></div>

        <div className="relative max-w-5xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white border border-red-200 text-red-600 text-sm font-medium shadow-sm">
            AI Bookkeeping for Founders
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-8">
            Your AI Financial Assistant
            <span className="block bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent">
              for Business
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Albdy automatically tracks revenue, expenses, and profits so founders
            can understand their business instantly.
          </p>

          <div className="flex justify-center gap-5 mb-8">

            <button
              onClick={() => router.push("/signup")}
              className="bg-red-600 hover:bg-red-700 text-white px-9 py-4 rounded-xl shadow-lg shadow-red-300/40 transition"
            >
              Start Free
            </button>

            <button
              onClick={() => router.push("/demo")}
              className="px-9 py-4 rounded-xl border border-gray-300 hover:border-red-600 hover:text-red-600 transition"
            >
              View Demo
            </button>

          </div>

          <p className="text-sm text-gray-500">
            No credit card required • Setup in under 2 minutes
          </p>

        </div>

      </section>


      {/* FEATURES */}

      <section className="py-28">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="text-4xl font-bold mb-4">
              Everything your finances need
            </h2>

          </div>

          <div className="grid md:grid-cols-4 gap-8">

            <Feature
              icon={<Brain size={28}/>}
              title="AI Financial Insights"
              text="Ask Albdy questions about revenue and profit instantly."
            />

            <Feature
              icon={<Receipt size={28}/>}
              title="Expense Tracking"
              text="Upload receipts and categorize expenses automatically."
            />

            <Feature
              icon={<BarChart3 size={28}/>}
              title="Real-Time Dashboards"
              text="Visualize financial trends instantly."
            />

            <Feature
              icon={<ShieldCheck size={28}/>}
              title="Secure Data"
              text="Bank-level encryption protects your financial data."
            />

          </div>

        </div>

      </section>

    </div>
  )
}


function Feature({
  icon,
  title,
  text
}:{
  icon:React.ReactNode
  title:string
  text:string
}){

  return(

    <div className="group rounded-2xl p-8 bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition">

      <div className="flex items-center justify-center w-14 h-14 bg-red-50 text-red-600 rounded-xl mb-5 group-hover:scale-110 transition">
        {icon}
      </div>

      <h3 className="font-semibold text-lg mb-3">
        {title}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed">
        {text}
      </p>

    </div>

  )

}