"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

import ChatBox from "@/components/ChatBox"
import Billing from "@/components/Billing"

import {
LineChart,
Line,
Area,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts"

/* ================= TYPES ================= */

type Transaction = {
id: string
date: string
description: string
amount: number
categoryId?: string
}

type Category = {
id: string
name: string
isRevenue: boolean
}

type Tab =
| "dashboard"
| "transactions"
| "business"
| "billing"
| "askai"
/* ================= DASHBOARD ================= */

export default function Dashboard(){

const router = useRouter()

const [tokenReady,setTokenReady] = useState(false)

const [transactions,setTransactions] = useState<Transaction[]>([])
const [categories,setCategories] = useState<Category[]>([])
const [values,setValues] = useState<Record<string,string>>({})

const [activeTab,setActiveTab] = useState<Tab>("dashboard")
const [search,setSearch] = useState("")
const [selected,setSelected] = useState<string[]>([])

const [settingsOpen, setSettingsOpen] = useState(false)

const [newCategoryName,setNewCategoryName] = useState("")
const [newCategoryType,setNewCategoryType] =
useState<"Revenue"|"Expense">("Expense")

/* ================= AUTH ================= */

useEffect(()=>{

const params = new URLSearchParams(window.location.search)
const tokenFromUrl = params.get("token")

if(tokenFromUrl){
localStorage.setItem("token",tokenFromUrl)
window.history.replaceState({}, "", "/dashboard")
}

const token = localStorage.getItem("token")

if(!token){
router.push("/auth/login")
return
}

setTokenReady(true)

},[router])

/* ================= LOAD ================= */

const loadData = async ()=>{

const [txRes,catRes] = await Promise.all([
api.get("/api/transactions"),
api.get("/api/categories")
])

setTransactions(txRes.data || [])

setCategories(
(catRes.data || []).map((c:any)=>({
...c,
isRevenue:Boolean(c.isRevenue)
}))
)

}

useEffect(()=>{
if(tokenReady) loadData()
},[tokenReady])

/* ================= FILTER ================= */

const filteredTransactions = useMemo(()=>{

return transactions.filter(t=>
t.description.toLowerCase().includes(search.toLowerCase())
)

},[transactions,search])

/* ================= TOTALS ================= */

const income = filteredTransactions
.filter(t=>t.amount>0)
.reduce((sum,t)=>sum+t.amount,0)

const expenses = filteredTransactions
.filter(t=>t.amount<0)
.reduce((sum,t)=>sum+t.amount,0)

const balance = income + expenses

/* ================= CHART ================= */

const chartData = useMemo(()=>{

const grouped:Record<string,number> = {}

filteredTransactions.forEach(t=>{

const date = new Date(t.date).toLocaleDateString()

if(!grouped[date]) grouped[date]=0
grouped[date]+=t.amount

})

const sorted = Object.keys(grouped).sort(
(a,b)=>new Date(a).getTime()-new Date(b).getTime()
)

let running = 0

return sorted.map(date=>{

running += grouped[date]

return{
date,
balance:running
}

})

},[filteredTransactions])

/* ================= CATEGORY ================= */

const createCategory = async ()=>{

if(!newCategoryName.trim()) return

await api.post("/api/categories",{
name:newCategoryName,
isRevenue:newCategoryType==="Revenue"
})

setNewCategoryName("")
loadData()

}

const deleteCategory = async(id:string)=>{

await api.delete(`/api/categories/${id}`)
loadData()

}

/* ================= SAVE BUSINESS ================= */

const saveBusiness = async ()=>{

const today = new Date().toISOString()

const entries = categories.map(cat=>{

const raw = values[cat.id]
if(!raw) return null

const value = Number(raw)
if(isNaN(value)) return null

return{
date:today,
description:cat.name,
amount:cat.isRevenue ? value : -Math.abs(value),
categoryId:cat.id
}

}).filter(Boolean)

await Promise.all(
entries.map(entry=>api.post("/api/transactions",entry))
)

setValues({})
loadData()
setActiveTab("transactions")

}

/* ================= DELETE TX ================= */

const deleteTransactions = async ()=>{

if(selected.length===0) return

await Promise.all(
selected.map(id=>api.delete(`/api/transactions/${id}`))
)

setSelected([])
loadData()

}

/* ================= LOADING ================= */

if(!tokenReady){

return(
<div className="h-screen flex items-center justify-center">
Loading...
</div>
)

}

/* ================= UI ================= */

return(

<div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">

{/* SIDEBAR */}

<aside className="w-64 bg-white border-r p-8">

<h2 className="text-red-500 font-bold text-xl mb-10">
Albdy
</h2>

{[
["dashboard","Overview"],
["transactions","Transactions"],
["business","Business"],
["billing","Billing"],
["askai","Ask AI"]

].map(([id,label])=>(

<button
key={id}
onClick={()=>setActiveTab(id as Tab)}
className={`w-full text-left px-4 py-3 rounded-xl mb-2 ${
activeTab===id
? "bg-red-500 text-white"
: "text-slate-600 hover:bg-slate-100"
}`}
>
{label}
</button>
))}

</aside>

{/* MAIN */}

<main className="flex-1 p-14 space-y-12">

{/* OVERVIEW */}

{activeTab==="dashboard" && (

<div className="bg-white p-10 rounded-3xl shadow-lg">

<h2 className="text-lg font-semibold mb-4">
Financial Overview
</h2>

<div className="text-3xl font-bold mb-6">
${balance.toFixed(2)}
</div>

<ResponsiveContainer width="100%" height={320}>

<LineChart data={chartData}>

<CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3"/>

<XAxis dataKey="date"/>
<YAxis/>
<Tooltip/>

<Line
type="monotone"
dataKey="balance"
stroke="#dc2626"
strokeWidth={3}
/>

<Area
type="monotone"
dataKey="balance"
fill="#fecaca"
/>

</LineChart>

</ResponsiveContainer>

</div>

)}

{/* TRANSACTIONS */}

{activeTab==="transactions" && (

<div className="bg-white p-10 rounded-3xl shadow-lg">

<div className="flex gap-4 mb-6">

<input
placeholder="Search..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-4 py-2 rounded-lg flex-1"
/>

<button
onClick={deleteTransactions}
className="bg-red-500 text-white px-4 py-2 rounded-lg"
>

Delete Selected

</button>

</div>

{filteredTransactions.map(tx=>(

<div key={tx.id} className="flex justify-between border-b py-3">

<div className="flex items-center gap-3">

<input
type="checkbox"
checked={selected.includes(tx.id)}
onChange={()=>{

if(selected.includes(tx.id)){
setSelected(prev=>prev.filter(id=>id!==tx.id))
}else{
setSelected(prev=>[...prev,tx.id])
}

}}
/>

<span>{tx.description}</span>

</div>

<div>${Math.abs(tx.amount).toFixed(2)}</div>

</div>

))}

</div>

)}

{/* BUSINESS */}

{activeTab==="business" && (

<div className="bg-white p-10 rounded-3xl shadow-lg max-w-3xl">

<h2 className="text-lg font-semibold mb-6">
Business Configuration
</h2>

{categories.map(cat=>(

<div key={cat.id} className="flex justify-between mb-4">

<span>{cat.name}</span>

<button
onClick={()=>deleteCategory(cat.id)}
className="text-red-500"
>
Delete
</button>

</div>

))}

<div className="flex gap-3 mt-6">

<input
placeholder="Category name"
value={newCategoryName}
onChange={(e)=>setNewCategoryName(e.target.value)}
className="border px-3 py-2 rounded-lg flex-1"
/>

<select
value={newCategoryType}
onChange={(e)=>setNewCategoryType(e.target.value as any)}
className="border px-3 py-2 rounded-lg"
>

<option value="Expense">Expense</option>
<option value="Revenue">Revenue</option>

</select>

</div>

<div className="flex gap-3 mt-4">

<button
onClick={createCategory}
className="bg-slate-900 text-white px-4 py-2 rounded-lg"
>
Create
</button>

<button
onClick={saveBusiness}
className="bg-red-500 text-white px-4 py-2 rounded-lg"
>
Save Configuration
</button>

</div>

</div>

)}

{activeTab==="billing" && <Billing/>}
{activeTab==="askai" && <ChatBox/>}

{/* SETTINGS */}


</main>
{settingsOpen && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white w-[420px] rounded-2xl p-8 shadow-xl">

<h2 className="text-lg font-semibold mb-6">
Settings
</h2>

<div className="space-y-4">

<button
onClick={()=>{
localStorage.removeItem("token")
router.push("/auth/login")
}}
className="w-full bg-red-500 text-white py-2 rounded-lg"
>
Logout
</button>

<button
onClick={()=>setSettingsOpen(true)}
className="w-full text-left px-4 py-3 rounded-xl mt-2 text-slate-600 hover:bg-slate-100"
>
Settings
</button>

</div>

</div>

</div>

)}

</div>

)

}