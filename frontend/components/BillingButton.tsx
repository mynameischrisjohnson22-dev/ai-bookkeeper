"use client"

import axios from "axios"

export default function BillingButton() {
  const upgrade = async (plan: string) => {
    const res = await axios.post(
      "http://localhost:5000/api/stripe/checkout",
      { plan }
    )

    window.location.href = res.data.url
  }

  return (
    <div style={{ marginTop: "24px", padding: "12px", border: "1px solid #ccc" }}>
      <h3>Upgrade Plan</h3>

      <button onClick={() => upgrade("basic_monthly")}>
        Basic Plan
      </button>

      <button onClick={() => upgrade("pro_monthly")} style={{ marginLeft: "12px" }}>
        Pro Plan
      </button>
    </div>
  )
}
