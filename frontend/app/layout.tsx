"use client"

import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

  const pathname = usePathname()

  const hideNavbar = pathname?.startsWith("/dashboard")

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">

        {/* NAVBAR (hidden on dashboard) */}

        {!hideNavbar && (
          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">

            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

              {/* LOGO */}

              <Link
                href="/"
                className="text-2xl font-bold tracking-tight text-slate-900 hover:text-red-600 transition"
              >
                Albdy
              </Link>

              {/* NAV LINKS */}

              <nav className="flex items-center gap-8 text-sm font-medium">

                <Link
                  href="/features"
                  className="text-slate-600 hover:text-red-600 transition"
                >
                  Features
                </Link>

                <Link
                  href="/pricing"
                  className="text-slate-600 hover:text-red-600 transition"
                >
                  Pricing
                </Link>

                <Link
                  href="/login"
                  className="text-slate-600 hover:text-red-600 transition"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
                >
                  Start Free
                </Link>

              </nav>

            </div>

          </header>
        )}

        {/* PAGE CONTENT */}

        <main className="w-full">
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