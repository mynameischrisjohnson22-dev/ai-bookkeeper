"use client"

import { useRouter } from "next/navigation"
import { BarChart3, Brain, Receipt, ShieldCheck } from "lucide-react"

export default function Home() {

  const router = useRouter()

  return (

    <div className="min-h-screen bg-white text-black">

      {/* NAVBAR */}

      <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-xl font-bold tracking-tight">
            Albdy
          </h1>

          <div className="flex items-center gap-6 text-sm">

            <button onClick={() => router.push("/features")} className="hover:text-red-600 transition">
              Features
            </button>

            <button onClick={() => router.push("/pricing")} className="hover:text-red-600 transition">
              Pricing
            </button>

            <button onClick={() => router.push("/login")} className="hover:text-red-600 transition">
              Login
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Start Free
            </button>

          </div>

        </div>

      </nav>


      {/* HERO */}

      <section className="relative text-center py-36 px-6 bg-gradient-to-b from-white via-red-50 to-white">

        <div className="absolute left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-red-200 blur-3xl opacity-30"></div>

        <div className="relative max-w-4xl mx-auto">

          <p className="text-red-600 font-semibold mb-4">
            AI Bookkeeping for Founders
          </p>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Understand your finances
            <span className="text-red-600"> instantly</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Albdy automatically tracks revenue, expenses, and financial insights
            so founders can focus on growing their business.
          </p>

          <div className="flex justify-center gap-4">

            <button
              onClick={() => router.push("/signup")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg shadow-lg shadow-red-200 transition"
            >
              Start Free
            </button>

            <button
              onClick={() => router.push("/demo")}
              className="border border-gray-300 px-8 py-4 rounded-lg hover:border-red-600 hover:text-red-600 transition"
            >
              View Demo
            </button>

          </div>

          <p className="text-sm text-gray-500 mt-6">
            No credit card required
          </p>

        </div>

      </section>


      {/* DASHBOARD PREVIEW */}

      <section className="flex justify-center px-6 pb-28">

        <img
          src="/dashboard-preview.png"
          className="rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.15)] max-w-6xl w-full"
          alt="Albdy dashboard preview"
        />

      </section>


      {/* PROBLEM SECTION */}

      <section className="py-24 bg-gray-50">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-10">
            Bookkeeping is broken for small businesses
          </h2>

          <div className="grid md:grid-cols-3 gap-10 text-left">

            <Problem
              title="Messy spreadsheets"
              text="Tracking finances manually becomes chaotic."
            />

            <Problem
              title="Expensive accountants"
              text="Hiring professionals can cost thousands per year."
            />

            <Problem
              title="Slow insights"
              text="Understanding business performance takes too long."
            />

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="py-28">

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">

            <h2 className="text-4xl font-bold mb-4">
              Everything your finances need
            </h2>

            <p className="text-gray-600 max-w-xl mx-auto">
              Albdy replaces spreadsheets, accountants,
              and complicated bookkeeping tools.
            </p>

          </div>

          <div className="grid md:grid-cols-4 gap-8">

            <Feature
              icon={<Brain size={28} />}
              title="AI Financial Insights"
              text="Ask Albdy questions about revenue and profit instantly."
            />

            <Feature
              icon={<Receipt size={28} />}
              title="Expense Tracking"
              text="Upload receipts and categorize expenses automatically."
            />

            <Feature
              icon={<BarChart3 size={28} />}
              title="Real-Time Dashboards"
              text="Visualize financial trends instantly."
            />

            <Feature
              icon={<ShieldCheck size={28} />}
              title="Secure Data"
              text="Bank-level encryption protects your financial data."
            />

          </div>

        </div>

      </section>


      {/* SOCIAL PROOF */}

      <section className="bg-gray-50 py-24">

        <div className="max-w-5xl mx-auto text-center px-6">

          <h2 className="text-3xl font-bold mb-10">
            Trusted by modern businesses
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <Stat number="10x" label="Faster bookkeeping" />
            <Stat number="80%" label="Less manual work" />
            <Stat number="24/7" label="AI financial insights" />

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section className="py-28">

        <div className="max-w-5xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold mb-16">
            How Albdy Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">

            <Step
              number="1"
              title="Connect your finances"
              text="Upload receipts or connect financial accounts."
            />

            <Step
              number="2"
              title="AI analyzes everything"
              text="Albdy categorizes and tracks every transaction."
            />

            <Step
              number="3"
              title="Get insights instantly"
              text="Ask questions about revenue, expenses, and profit."
            />

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="text-center py-32 bg-gradient-to-b from-red-50 to-white">

        <h2 className="text-4xl font-bold mb-6">
          Stop guessing your finances
        </h2>

        <p className="text-gray-600 mb-8">
          Let Albdy automatically handle your bookkeeping.
        </p>

        <button
          onClick={() => router.push("/signup")}
          className="bg-red-600 hover:bg-red-700 text-white px-14 py-6 rounded-xl text-lg shadow-lg shadow-red-200 transition"
        >
          Start Using Albdy
        </button>

      </section>


      {/* FOOTER */}

      <footer className="border-t py-16">

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 px-6 text-sm text-gray-500">

          <div>
            <h3 className="font-bold mb-3 text-red-600">
              Albdy
            </h3>
            <p>AI bookkeeping for modern businesses.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-black">Product</h4>
            <p>Features</p>
            <p>Pricing</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-black">Company</h4>
            <p>About</p>
            <p>Contact</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-black">Legal</h4>
            <p>Privacy</p>
            <p>Terms</p>
          </div>

        </div>

      </footer>

    </div>
  )
}


/* COMPONENTS */

function Feature({ icon, title, text }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition">
      <div className="text-red-600 mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  )
}

function Problem({ title, text }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  )
}

function Stat({ number, label }) {
  return (
    <div>
      <h3 className="text-4xl font-bold text-red-600 mb-2">{number}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  )
}

function Step({ number, title, text }) {
  return (
    <div>
      <div className="text-red-600 font-bold text-2xl mb-3">{number}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  )
}