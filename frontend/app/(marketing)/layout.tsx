import Link from "next/link"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">

          <Link href="/" className="font-bold text-xl">
            Albdy
          </Link>

          <div className="flex gap-6 items-center">

            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Login</Link>

            <Link
              href="/signup"
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Start Free
            </Link>

          </div>

        </div>

      </nav>

      {children}
    </>
  )
}