import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: {
    default: "Albdy",
    template: "%s | Albdy",
  },
  description: "AI-powered business finance assistant",
  applicationName: "Albdy",
  keywords: ["finance", "bookkeeping", "AI", "business"],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">

        {/* Page Wrapper */}
        <div className="min-h-screen flex flex-col">

          {/* Content */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
            {children}
          </main>

        </div>

        {/* Global Notifications */}
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#111827",
              color: "#fff",
              borderRadius: "10px",
              padding: "12px 16px",
            },
          }}
        />

      </body>
    </html>
  )
}