"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {

  const pathname = usePathname()

  const hideNavbar = pathname?.startsWith("/dashboard")

  if (hideNavbar) return null

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-slate-900 hover:text-red-600 transition"
        >
          Albdy
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium">

          <Link href="/features" className="text-slate-600 hover:text-red-600">
            Features
          </Link>

          <Link href="/pricing" className="text-slate-600 hover:text-red-600">
            Pricing
          </Link>

          <Link href="/login" className="text-slate-600 hover:text-red-600">
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Start Free
          </Link>

        </nav>

      </div>

    </header>
  )
}