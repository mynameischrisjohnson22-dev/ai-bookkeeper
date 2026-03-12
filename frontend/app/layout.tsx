import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"
import Navbar from "@/components/Navbar"

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

        <Navbar />

        <main>{children}</main>

        <Toaster position="top-right" />

      </body>
    </html>
  )
}