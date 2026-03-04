"use client"

import { Suspense } from "react"
import OAuthSuccessContent from "./OAuthSuccessContent"
export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={<p>Signing you in...</p>}>
      <OauthSuccessContent />
    </Suspense>
  )
}