"use client"

import { useRouter } from "next/navigation"
import { BarChart3, Brain, Receipt, ShieldCheck } from "lucide-react"
import React from "react"

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
            can understand their business instantly and make smarter decisions.
          </p>

          <div className="flex justify-center items-center gap-5 mb-8">

            <button
              onClick={() => router.push("/signup")}
              className="bg-red-600 hover:bg-red-700 text-white px-9 py-4 rounded-xl shadow-lg shadow-red-300/40 transition-all duration-200 hover:scale-[1.02]"
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


      {/* DASHBOARD PREVIEW */}

      <section className="flex justify-center px-6 pb-28">

        <img
          src="/dashboard-preview.png"
          className="rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.15)] max-w-6xl w-full"
          alt="Albdy dashboard preview"
        />

      </section>


      {/* PROBLEMS */}

      <section className="py-24 bg-gray-50">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-10">
            Bookkeeping is broken for small businesses
          </h2>

          <div className="grid md:grid-cols-3 gap-10 text-left">

            <Problem title="Messy spreadsheets" text="Tracking finances manually becomes chaotic." />
            <Problem title="Expensive accountants" text="Hiring professionals can cost thousands per year." />
            <Problem title="Slow insights" text="Understanding business performance takes too long." />

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
              Albdy replaces spreadsheets, accountants, and complicated bookkeeping tools.
            </p>

          </div>

          <div className="grid md:grid-cols-4 gap-8">

            <Feature icon={<Brain size={28} />} title="AI Financial Insights" text="Ask Albdy questions about revenue and profit instantly." />
            <Feature icon={<Receipt size={28} />} title="Expense Tracking" text="Upload receipts and categorize expenses automatically." />
            <Feature icon={<BarChart3 size={28} />} title="Real-Time Dashboards" text="Visualize financial trends instantly." />
            <Feature icon={<ShieldCheck size={28} />} title="Secure Data" text="Bank-level encryption protects your financial data." />

          </div>

        </div>

      </section>


      {/* STATS */}

      <section className="bg-gray-50 py-24">

        <div className="max-w-5xl mx-auto text-center px-6 grid md:grid-cols-3 gap-10">

          <Stat number="10x" label="Faster bookkeeping" />
          <Stat number="80%" label="Less manual work" />
          <Stat number="24/7" label="AI financial insights" />

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section className="py-28">

        <div className="max-w-5xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold mb-16">
            How Albdy Works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">

            <Step number="1" title="Connect your finances" text="Upload receipts or connect financial accounts." />
            <Step number="2" title="AI analyzes everything" text="Albdy categorizes and tracks every transaction." />
            <Step number="3" title="Get insights instantly" text="Ask questions about revenue, expenses, and profit." />

          </div>

        </div>

      </section>


      {/* FAQ */}

      <section className="py-28 bg-gray-50">

        <div className="max-w-4xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">

            <FAQ question="How does Albdy track expenses?" answer="Albdy automatically categorizes receipts and transactions so you always know where your money is going." />
            <FAQ question="Is my financial data secure?" answer="Yes. Albdy uses bank-level encryption." />
            <FAQ question="Do I need accounting knowledge?" answer="No. Albdy simplifies finances so anyone can understand them." />
            <FAQ question="Can I cancel anytime?" answer="Yes. You can cancel anytime." />

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

      <footer className="border-t py-20">

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 px-6 text-sm">

          <div>
            <h3 className="font-bold text-lg text-red-600 mb-3">Albdy</h3>
            <p className="text-gray-500">AI bookkeeping for modern businesses.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-gray-500">
              <li>Features</li>
              <li>Pricing</li>
              <li>Dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-gray-500">
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-gray-500">
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>

        </div>

      </footer>

    </div>
  )
}