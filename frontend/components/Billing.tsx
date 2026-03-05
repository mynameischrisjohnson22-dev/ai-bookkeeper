"use client"

import api from "@/lib/api"
import { useState } from "react"

export default function Billing() {

  const [loading,setLoading] = useState(false)

  const checkout = async (priceId:string) => {
    try{

      setLoading(true)

      const res = await api.post("/api/billing/checkout",{
        priceId
      })

      window.location.href = res.data.url

    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-10">

      <div>
        <h2 className="text-2xl font-bold mb-2">
          Billing
        </h2>

        <p className="text-slate-500">
          Upgrade your Albdy plan
        </p>
      </div>

      {/* PLAN CARDS */}

      <div className="grid md:grid-cols-2 gap-8">

        {/* MONTHLY */}

        <div className="bg-white p-10 rounded-2xl border shadow-sm">

          <h3 className="text-lg font-semibold mb-2">
            Monthly
          </h3>

          <div className="text-3xl font-bold mb-4">
            $5
            <span className="text-sm text-slate-500">
              /month
            </span>
          </div>

          <p className="text-sm text-slate-500 mb-6">
            3 day free trial
          </p>

          <ul className="space-y-2 text-sm mb-8">
            <li>✔ Unlimited transactions</li>
            <li>✔ AI bookkeeping assistant</li>
            <li>✔ Financial dashboard</li>
          </ul>

          <button
            onClick={()=>checkout("pri_01kjtcazh9v64m557f0zsbdvwg")}
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-xl"
          >
            Start Trial
          </button>

        </div>


        {/* LIFETIME */}

        <div className="bg-white p-10 rounded-2xl border shadow-sm">

          <h3 className="text-lg font-semibold mb-2">
            Lifetime
          </h3>

          <div className="text-3xl font-bold mb-4">
            $47
          </div>

          <p className="text-sm text-slate-500 mb-6">
            Pay once, use forever
          </p>

          <ul className="space-y-2 text-sm mb-8">
            <li>✔ Everything in Monthly</li>
            <li>✔ No recurring payments</li>
            <li>✔ Lifetime access</li>
          </ul>

          <button
            onClick={()=>checkout("pri_01kjtcazmqj9b8rvgmpd3j8kb")}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            Buy Lifetime
          </button>

        </div>

      </div>

    </div>
  )
}