"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

import Billing from "@/components/Billing"

import {
LineChart,
Line,
Area,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid,
Legend
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
| "settings"

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

/* ================= LOAD DATA ================= */

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
return transactions.filter(t =>
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

/* ================= CHART DATA ================= */

type ChartPoint = {
date:string
revenue:number
expenses:number
profit:number
balance:number
}

const chartData = useMemo<ChartPoint[]>(()=>{

const grouped:Record<string,ChartPoint> = {}

transactions.forEach(t=>{

const date = new Date(t.date).toISOString().slice(0,10)

if(!grouped[date]){
grouped[date] = {
date,
revenue:0,
expenses:0,
profit:0,
balance:0
}
}

if(t.amount>0){
grouped[date].revenue += t.amount
}else{
grouped[date].expenses += Math.abs(t.amount)
}

})

const sorted = Object.values(grouped).sort(
(a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()
)

let running = 0

return sorted.map(d=>{

const profit = d.revenue - d.expenses
running += profit

return{
...d,
profit,
balance:running
}

})

},[transactions])

/* ================= CATEGORY ================= */

const createCategory = async()=>{

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

/* ================= DELETE TX ================= */

const deleteTransactions = async()=>{

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

<div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-indigo-50">

{/* ================= SIDEBAR ================= */}

<aside className="w-64 bg-white border-r p-8">

<h2 className="text-red-500 font-bold text-xl mb-10">
Albdy
</h2>

{[
["dashboard","Overview"],
["transactions","Transactions"],
["business","Business"],
["billing","Billing"]
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

<button
onClick={()=>setActiveTab("settings")}
className="w-full text-left px-4 py-3 rounded-xl mt-2 text-slate-600 hover:bg-slate-100"
>
Settings
</button>

</aside>

{/* ================= MAIN ================= */}

<main className="flex-1 p-10 space-y-10">

{/* ================= DASHBOARD ================= */}

{activeTab==="dashboard" && (

<section className="max-w-6xl space-y-8">

<div className="bg-white p-8 rounded-3xl shadow border">

<p className="text-sm text-slate-500">Current Balance</p>

<h2 className="text-4xl font-bold text-green-600 mt-2">
${balance.toFixed(2)}
</h2>

<p className="text-sm text-slate-400">
Income minus expenses
</p>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="bg-white p-6 rounded-2xl shadow">
<p className="text-sm text-slate-500">Income</p>
<p className="text-2xl font-bold text-green-600">
${income.toFixed(2)}
</p>
</div>

<div className="bg-white p-6 rounded-2xl shadow">
<p className="text-sm text-slate-500">Expenses</p>
<p className="text-2xl font-bold text-red-500">
${Math.abs(expenses).toFixed(2)}
</p>
</div>

</div>

<div className="bg-white p-10 rounded-3xl shadow border">

<h2 className="text-lg font-semibold mb-6">
Financial Overview
</h2>

<ResponsiveContainer width="100%" height={340}>

<LineChart data={chartData}>

<CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3"/>

<XAxis dataKey="date"/>

<YAxis/>

<Tooltip formatter={(v:number)=>`$${v.toFixed(2)}`}/>

<Legend/>

<Line type="monotone" dataKey="revenue" stroke="#22c55e"/>
<Line type="monotone" dataKey="expenses" stroke="#ef4444"/>

<Area
type="monotone"
dataKey="profit"
stroke="#16a34a"
fillOpacity={0.2}
fill="#16a34a"
/>

<Line
type="monotone"
dataKey="balance"
stroke="#6366f1"
strokeDasharray="5 5"
/>

</LineChart>

</ResponsiveContainer>

</div>

</section>

)}

{/* ================= TRANSACTIONS ================= */}

{activeTab==="transactions" && (

<div className="max-w-4xl space-y-6">

<input
placeholder="Search transactions..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full border px-4 py-3 rounded-xl"
/>

<div className="bg-white rounded-3xl shadow divide-y">

{filteredTransactions.map(tx=>{

const positive = tx.amount>0

return(

<div key={tx.id}
className="flex justify-between px-6 py-5">

<div>

<p className="font-medium">{tx.description}</p>

<p className="text-xs text-slate-400">
{new Date(tx.date).toLocaleDateString()}
</p>

</div>

<div className={
positive ? "text-green-600 font-semibold"
: "text-red-500 font-semibold"
}>

{positive?"+":"-"}${Math.abs(tx.amount).toFixed(2)}

</div>

</div>

)

})}

</div>

</div>

)}

{/* ================= BILLING ================= */}

{activeTab==="billing" && (
<div className="max-w-4xl">
<Billing/>
</div>
)}

{/* ================= SETTINGS ================= */}

{activeTab==="settings" && (

<div className="max-w-3xl space-y-8">

<h1 className="text-2xl font-semibold">
Settings
</h1>

<section className="bg-white p-8 rounded-2xl shadow space-y-4">

<h2 className="font-semibold">Account</h2>

<button
onClick={()=>{
localStorage.removeItem("token")
router.push("/auth/login")
}}
className="bg-black text-white px-5 py-2 rounded-lg"
>
Log Out
</button>

</section>

</div>

)}

</main>

</div>

)

}