"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white text-black">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Albdy</h1>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="text-gray-600"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          Your AI Bookkeeping Assistant
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Albdy automatically tracks revenue, expenses, and financial trends
          so you can focus on growing your business.
        </p>

        <button
          onClick={() => router.push("/signup")}
          className="bg-black text-white px-8 py-4 rounded text-lg"
        >
          Start Free
        </button>

      </section>

      {/* FEATURES */}
      <section className="py-20 bg-gray-50">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">

          <div>
            <h3 className="text-xl font-semibold mb-3">
              AI Financial Insights
            </h3>
            <p className="text-gray-600">
              Ask Albdy questions about your revenue, expenses,
              and business performance.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">
              Automatic Expense Tracking
            </h3>
            <p className="text-gray-600">
              Upload receipts or connect accounts and Albdy
              categorizes everything automatically.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">
              Real-Time Dashboards
            </h3>
            <p className="text-gray-600">
              See revenue trends, profit margins,
              and financial insights instantly.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="text-center py-24">

        <h2 className="text-3xl font-bold mb-6">
          Start managing your business finances smarter
        </h2>

        <button
          onClick={() => router.push("/signup")}
          className="bg-black text-white px-8 py-4 rounded text-lg"
        >
          Try Albdy
        </button>

      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-gray-500">
        © {new Date().getFullYear()} Albdy
      </footer>

    </div>
  )
}
