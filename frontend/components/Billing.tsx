"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function Billing() {

  const [billing,setBilling] = useState<"monthly"|"yearly"|"lifetime">("monthly")
  const [loading,setLoading] = useState(false)

  const checkout = async (plan:"essential"|"plus") => {

    try{

      setLoading(true)

      const res = await api.post("/api/billing/checkout",{
        plan,
        billing
      })

      window.location.href = res.data.url

    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }

  }

  const prices = {
    essential:{
      monthly:5,
      yearly:47,
      lifetime:79
    },
    plus:{
      monthly:7.99,
      yearly:55,
      lifetime:100
    }
  }

  return (

<div className="max-w-5xl space-y-10">

<h2 className="text-2xl font-bold">
Billing
</h2>

<p className="text-slate-500">
Upgrade your Albdy plan
</p>

{/* BILLING SWITCH */}

<div className="flex gap-3 bg-white border rounded-xl p-2 w-fit">

{["monthly","yearly","lifetime"].map(type=>(

<button
key={type}
onClick={()=>setBilling(type as any)}
className={`px-4 py-2 rounded-lg text-sm ${
billing===type
? "bg-red-500 text-white"
: "text-slate-600 hover:bg-slate-100"
}`}
>
{type.charAt(0).toUpperCase()+type.slice(1)}
</button>

))}

</div>

{/* PLANS */}

<div className="grid md:grid-cols-2 gap-8">

{/* ESSENTIAL */}

<div className="bg-white p-10 rounded-2xl border shadow-sm">

<h3 className="text-lg font-semibold mb-2">
Essential
</h3>

<div className="text-3xl font-bold mb-4">
${prices.essential[billing]}
{billing!=="lifetime" && (
<span className="text-sm text-slate-500">
/{billing==="monthly"?"month":"year"}
</span>
)}
</div>

<ul className="space-y-2 text-sm mb-8">
<li>✔ Unlimited transactions</li>
<li>✔ AI bookkeeping assistant</li>
<li>✔ Financial dashboard</li>
</ul>

<button
onClick={()=>checkout("essential")}
disabled={loading}
className="w-full bg-red-500 text-white py-3 rounded-xl"
>
Choose Essential
</button>

</div>


{/* PLUS */}

<div className="bg-white p-10 rounded-2xl border shadow-sm">

<h3 className="text-lg font-semibold mb-2">
Plus+
</h3>

<div className="text-3xl font-bold mb-4">
${prices.plus[billing]}
{billing!=="lifetime" && (
<span className="text-sm text-slate-500">
/{billing==="monthly"?"month":"year"}
</span>
)}
</div>

<ul className="space-y-2 text-sm mb-8">
<li>✔ Everything in Essential</li>
<li>✔ Advanced analytics</li>
<li>✔ Priority AI processing</li>
</ul>

<button
onClick={()=>checkout("plus")}
disabled={loading}
className="w-full bg-black text-white py-3 rounded-xl"
>
Choose Plus+
</button>

</div>

</div>

</div>

  )

}