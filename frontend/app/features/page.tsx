"use client"

import { useRouter } from "next/navigation"
import { Brain, Receipt, BarChart3, ShieldCheck, Zap, Bot } from "lucide-react"

export default function Features() {

  const router = useRouter()

  return (

    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-white py-32 px-6">

      {/* GLOW BACKGROUND */}

      <div className="absolute left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-red-200 blur-3xl opacity-30"></div>

      <div className="relative max-w-6xl mx-auto">

        {/* TITLE */}

        <div className="text-center mb-20">

          <h1 className="text-5xl font-bold mb-6">
            Albdy Features
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Everything you need to understand and manage your business finances
            automatically with AI.
          </p>

        </div>


        {/* FEATURE GRID */}

        <div className="grid md:grid-cols-3 gap-8">

          <Feature
            icon={<Brain size={26} />}
            title="AI Financial Insights"
            text="Ask Albdy questions about revenue, expenses, profits, and trends instantly."
          />

          <Feature
            icon={<Receipt size={26} />}
            title="Automatic Expense Tracking"
            text="Upload receipts or connect accounts and Albdy categorizes expenses automatically."
          />

          <Feature
            icon={<BarChart3 size={26} />}
            title="Real-Time Dashboards"
            text="Visualize revenue trends, profit margins, and key financial metrics."
          />

          <Feature
            icon={<Bot size={26} />}
            title="AI Finance Assistant"
            text="Chat with Albdy to understand your financial performance and business health."
          />

          <Feature
            icon={<Zap size={26} />}
            title="Instant Reports"
            text="Generate financial reports in seconds without spreadsheets."
          />

          <Feature
            icon={<ShieldCheck size={26} />}
            title="Secure Financial Data"
            text="Bank-level encryption keeps your financial data safe and private."
          />

        </div>


        {/* FEATURE HIGHLIGHT */}

        <div className="mt-32 grid md:grid-cols-2 gap-16 items-center">

          <div>

            <h2 className="text-4xl font-bold mb-6">
              Understand your finances instantly
            </h2>

            <p className="text-gray-600 mb-6">
              Albdy analyzes your revenue and expenses automatically so you always
              know how your business is performing.
            </p>

            <ul className="space-y-3 text-gray-600">

              <li>• Track revenue and expenses automatically</li>
              <li>• See profit trends over time</li>
              <li>• Understand where your money goes</li>

            </ul>

          </div>


          <div className="bg-white border rounded-2xl p-8 shadow-xl">

            <p className="text-sm text-gray-500 mb-4">
              Example Insight
            </p>

            <p className="text-lg font-medium">
              "Your revenue increased 32% this month while expenses stayed stable.
              Your profit margin improved from 21% to 28%."
            </p>

          </div>

        </div>


        {/* CTA */}

        <div className="text-center mt-32">

          <h2 className="text-4xl font-bold mb-6">
            Start managing your finances with AI
          </h2>

          <button
            onClick={()=>router.push("/signup")}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl text-lg shadow-lg shadow-red-200 transition"
          >
            Start Free
          </button>

        </div>

      </div>

    </div>

  )
}


/* FEATURE CARD */

function Feature({ icon, title, text }:{
  icon:React.ReactNode
  title:string
  text:string
}){

  return(

    <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition">

      <div className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl mb-4">
        {icon}
      </div>

      <h3 className="font-semibold text-lg mb-2">
        {title}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed">
        {text}
      </p>

    </div>

  )

}