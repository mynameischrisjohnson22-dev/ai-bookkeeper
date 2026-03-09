"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function BillingButton() {

  const [loading,setLoading] = useState(false)

  const upgrade = async (plan:"essential"|"plus") => {

    try{

      setLoading(true)

      const res = await api.post("/api/billing/checkout",{
        plan,
        billing:"monthly"
      })

      const checkoutUrl =
        res.data.url ||
        res.data.checkoutUrl ||
        res.data.checkout_url

      if(!checkoutUrl){
        console.error("Checkout URL missing:",res.data)
        alert("Checkout failed. Please try again.")
        return
      }

      window.location.href = checkoutUrl

    }catch(err){

      console.error("Upgrade error:",err)
      alert("Something went wrong starting checkout.")

    }finally{

      setLoading(false)

    }

  }

  return (

    <div className="mt-6 p-4 border rounded-lg">

      <h3 className="text-lg font-semibold mb-4">
        Upgrade Plan
      </h3>

      <button
        disabled={loading}
        onClick={()=>upgrade("essential")}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Loading..." : "Essential Plan"}
      </button>

      <button
        disabled={loading}
        onClick={()=>upgrade("plus")}
        className="bg-black text-white px-4 py-2 rounded-lg ml-3"
      >
        {loading ? "Loading..." : "Plus Plan"}
      </button>

    </div>

  )

}