"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white text-black">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-gray-200">

        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-xl font-bold tracking-tight">
            Albdy
          </h1>

          <div className="flex items-center gap-6 text-sm">

            <button
              onClick={() => router.push("/features")}
              className="hover:text-red-600 transition"
            >
              Features
            </button>

            <button
              onClick={() => router.push("/pricing")}
              className="hover:text-red-600 transition"
            >
              Pricing
            </button>

            <button
              onClick={() => router.push("/login")}
              className="hover:text-red-600 transition"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition active:scale-95"
            >
              Start Free
            </button>

          </div>

        </div>

      </nav>

      {/* HERO */}
      <section className="relative text-center py-40 px-6 bg-gradient-to-b from-white via-red-50 to-white">

        {/* Glow background */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-red-200 blur-3xl opacity-30"></div>

        <div className="relative max-w-3xl mx-auto">

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Your <span className="text-red-600">AI Bookkeeping Assistant</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Albdy automatically tracks revenue, expenses, and financial insights
            so you can focus on growing your business.
          </p>

          <div className="flex justify-center gap-4">

            <button
              onClick={() => router.push("/signup")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg transition active:scale-95 shadow-lg shadow-red-200"
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
            Trusted by founders and small businesses worldwide
          </p>

        </div>

      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="flex justify-center px-6 pb-32">

        <img
          src="/dashboard-preview.png"
          className="rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.15)] max-w-6xl w-full"
          alt="Albdy dashboard preview"
        />

      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent max-w-6xl mx-auto"></div>

      {/* PROBLEM SECTION */}
      <section className="bg-gray-50 py-32">

        <div className="max-w-5xl mx-auto text-center px-6">

          <h2 className="text-3xl font-bold mb-12">
            Bookkeeping shouldn’t slow down your business
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div>
              <h3 className="font-semibold mb-2">
                Messy Spreadsheets
              </h3>

              <p className="text-gray-600">
                Financial tracking becomes chaotic and difficult to manage.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Expensive Accountants
              </h3>

              <p className="text-gray-600">
                Hiring professionals can be costly for small businesses.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Slow Financial Insights
              </h3>

              <p className="text-gray-600">
                Understanding your business performance takes too long.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="py-32">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition duration-300">

            <h3 className="text-xl font-semibold mb-3 text-red-600">
              AI Financial Insights
            </h3>

            <p className="text-gray-600">
              Ask Albdy questions about revenue, expenses, and profits.
            </p>

          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition duration-300">

            <h3 className="text-xl font-semibold mb-3 text-red-600">
              Automatic Expense Tracking
            </h3>

            <p className="text-gray-600">
              Upload receipts or connect accounts and Albdy categorizes them automatically.
            </p>

          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] transition duration-300">

            <h3 className="text-xl font-semibold mb-3 text-red-600">
              Real-Time Dashboards
            </h3>

            <p className="text-gray-600">
              See revenue trends, profit margins, and insights instantly.
            </p>

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 py-32">

        <div className="max-w-4xl mx-auto text-center px-6">

          <h2 className="text-3xl font-bold mb-12">
            How Albdy Works
          </h2>

          <div className="space-y-8">

            <div>
              <h3 className="font-semibold">
                1 Connect your finances
              </h3>

              <p className="text-gray-600">
                Upload receipts or connect accounts.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                2 Albdy analyzes everything
              </h3>

              <p className="text-gray-600">
                AI categorizes revenue and expenses automatically.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                3 Get insights instantly
              </h3>

              <p className="text-gray-600">
                Ask questions about your finances anytime.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="text-center py-40 bg-gradient-to-b from-red-50 to-white">

        <h2 className="text-4xl font-bold mb-6">
          Stop guessing your finances.
        </h2>

        <p className="text-gray-600 mb-8">
          Let Albdy automatically handle your bookkeeping.
        </p>

        <button
          onClick={() => router.push("/signup")}
          className="bg-red-600 hover:bg-red-700 text-white px-14 py-6 rounded-xl text-lg shadow-lg shadow-red-200 transition active:scale-95"
        >
          Start Using Albdy
        </button>

      </section>

      {/* FOOTER */}
      <footer className="border-t bg-white py-16">

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 px-6 text-sm text-gray-500">

          <div>
            <h3 className="font-bold mb-3 text-red-600">
              Albdy
            </h3>

            <p>
              AI bookkeeping for modern businesses.
            </p>
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