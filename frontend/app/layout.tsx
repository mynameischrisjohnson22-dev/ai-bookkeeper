import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"
import Link from "next/link"

export const metadata: Metadata = {
  title: {
    default: "Albdy",
    template: "%s | Albdy",
  },
  description: "AI-powered business finance assistant",
  applicationName: "Albdy",
  keywords: ["finance", "bookkeeping", "AI", "business"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">

        {/* GLOBAL NAVBAR */}

        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">

          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

            {/* LOGO */}

            <Link
              href="/"
              className="text-xl font-bold tracking-tight hover:text-red-600 transition"
            >
              Albdy
            </Link>

            {/* NAV LINKS */}

            <div className="flex items-center gap-6 text-sm">

              <Link
                href="/features"
                className="hover:text-red-600 transition"
              >
                Features
              </Link>

              <Link
                href="/pricing"
                className="hover:text-red-600 transition"
              >
                Pricing
              </Link>

              <Link
                href="/login"
                className="hover:text-red-600 transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Start Free
              </Link>

            </div>

          </div>

        </nav>

        {/* PAGE CONTENT */}

        <main className="min-h-screen w-full">
          {children}
        </main>

        {/* TOASTS */}

        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#111827",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "12px 16px",
            },
          }}
        />

      </body>
    </html>
  )
}