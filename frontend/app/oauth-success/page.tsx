"use client"

import { Suspense } from "react"
import OAuthSuccessContent from "./OAuthSuccessContent"

export default function OAuthSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={<p className="text-gray-500">Signing you in...</p>}>
        <OAuthSuccessContent />
      </Suspense>
    </div>
  )
}