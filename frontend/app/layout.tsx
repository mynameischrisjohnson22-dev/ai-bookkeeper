import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "Albdy",
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
        <main className="max-w-7xl mx-auto px-6 py-10">
          {children}
        </main>

        {/* global notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  )
}