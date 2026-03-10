"use client"

import { Brain, Receipt, BarChart3, ShieldCheck, Zap, Bot } from "lucide-react"

export default function Features() {

  return (

    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white py-32 px-6">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-20">

          <h1 className="text-5xl font-bold mb-6">
            Albdy Features
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Everything you need to understand your business finances automatically with AI.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <Feature
            icon={<Brain size={28}/>}
            title="AI Financial Insights"
            text="Ask Albdy questions about revenue, expenses and profit."
          />

          <Feature
            icon={<Receipt size={28}/>}
            title="Automatic Expense Tracking"
            text="Upload receipts and Albdy categorizes them instantly."
          />

          <Feature
            icon={<BarChart3 size={28}/>}
            title="Real-Time Dashboards"
            text="Track revenue, expenses and profit visually."
          />

          <Feature
            icon={<Bot size={28}/>}
            title="AI Finance Assistant"
            text="Chat with Albdy about your business performance."
          />

          <Feature
            icon={<Zap size={28}/>}
            title="Instant Reports"
            text="Generate financial reports in seconds."
          />

          <Feature
            icon={<ShieldCheck size={28}/>}
            title="Secure Financial Data"
            text="Bank-level encryption protects your financial data."
          />

        </div>

      </div>

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

    <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition">

      <div className="w-14 h-14 flex items-center justify-center bg-red-50 text-red-600 rounded-xl mb-5">
        {icon}
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-600 text-sm">
        {text}
      </p>

    </div>

  )

}