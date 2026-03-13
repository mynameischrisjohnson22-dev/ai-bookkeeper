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

const income =
filteredTransactions
.filter(t=>t.amount>0)
.reduce((sum,t)=>sum+t.amount,0)

const expenses =
filteredTransactions
.filter(t=>t.amount<0)
.reduce((sum,t)=>sum+t.amount,0)

const balance = income + expenses


/* ================= CHART DATA ================= */

type ChartPoint = {
  date: string
  revenue: number
  expenses: number
  profit: number
  balance: number
}

const chartData = useMemo<ChartPoint[]>(() => {

  const grouped: Record<string, ChartPoint> = {}

  transactions.forEach((t) => {

    const date = new Date(t.date).toISOString().slice(0, 10)

    if (!grouped[date]) {
      grouped[date] = {
        date,
        revenue: 0,
        expenses: 0,
        profit: 0,
        balance: 0
      }
    }

    if (t.amount > 0) {
      grouped[date].revenue += t.amount
    } else {
      grouped[date].expenses += Math.abs(t.amount)
    }

  })

  const sorted = Object.values(grouped).sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  )

  let runningBalance = 0

  return sorted.map((d) => {

    const profit = d.revenue - d.expenses
    runningBalance += profit

    return {
      ...d,
      profit,
      balance: runningBalance
    }

  })

}, [transactions])


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
].map(([id,label]) => (

<button
key={id}
onClick={() => setActiveTab(id as Tab)}
className={`w-full text-left px-4 py-3 rounded-xl mb-2 ${
activeTab === id
? "bg-red-500 text-white"
: "text-slate-600 hover:bg-slate-100"
}`}
>
{label}
</button>

))}

<button
onClick={() => setActiveTab("settings")}
className="w-full text-left px-4 py-3 rounded-xl mt-2 text-slate-600 hover:bg-slate-100"
>
Settings
</button>

</aside>


{/* MAIN */}

<main className="flex-1 p-10 space-y-10">


{/* ================= OVERVIEW ================= */}

{activeTab === "dashboard" && (

<section className="max-w-6xl space-y-8">


<div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">

<p className="text-sm text-slate-500">
Current Balance
</p>

<h2 className="text-4xl font-bold text-green-600 mt-2">
${balance.toFixed(2)}
</h2>

<p className="text-slate-400 text-sm mt-1">
Income minus expenses
</p>

</div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="bg-white rounded-2xl p-6 shadow border border-slate-100">
<p className="text-sm text-slate-500">Income</p>
<p className="text-2xl font-bold text-green-600 mt-1">
${income.toFixed(2)}
</p>
</div>

<div className="bg-white rounded-2xl p-6 shadow border border-slate-100">
<p className="text-sm text-slate-500">Expenses</p>
<p className="text-2xl font-bold text-red-500 mt-1">
${Math.abs(expenses).toFixed(2)}
</p>
</div>

</div>


<div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100">

<h2 className="text-lg font-semibold mb-6">
Financial Overview
</h2>


<ResponsiveContainer width="100%" height={340}>

<LineChart
data={chartData}
margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
>

<CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

<XAxis
dataKey="date"
tick={{ fontSize: 12 }}
tickFormatter={(date)=>
new Date(date).toLocaleDateString(undefined,{
month:"short",
day:"numeric"
})
}
/>

<YAxis
tick={{ fontSize: 12 }}
tickFormatter={(v)=>`$${v}`}
/>

<Tooltip
formatter={(value:number)=>`$${value.toFixed(2)}`}
contentStyle={{
borderRadius:"10px",
border:"1px solid #e5e7eb",
fontSize:"13px"
}}
/>

<Legend />

<Line
type="natural"
dataKey="revenue"
stroke="#22c55e"
strokeWidth={3}
dot={false}
animationDuration={700}
name="Revenue"
/>

<Line
type="natural"
dataKey="expenses"
stroke="#ef4444"
strokeWidth={2}
dot={false}
animationDuration={700}
name="Expenses"
/>

<Area
type="natural"
dataKey="profit"
stroke="#16a34a"
fill="url(#profitGradient)"
strokeWidth={2}
animationDuration={700}
name="Profit"
/>

<Line
type="natural"
dataKey="balance"
stroke="#6366f1"
strokeWidth={2}
strokeDasharray="5 5"
dot={false}
animationDuration={700}
name="Balance"
/>

</LineChart>

</ResponsiveContainer>

</div>

</section>

)}


{/* ================= TRANSACTIONS ================= */}

{activeTab === "transactions" && (

<div className="max-w-4xl space-y-6">

<input
placeholder="Search transactions..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full border border-slate-200 px-4 py-3 rounded-xl"
/>

<div className="bg-white rounded-3xl shadow divide-y">

{filteredTransactions.map(tx => {

const positive = tx.amount > 0

return(

<div
key={tx.id}
className="flex items-center justify-between px-6 py-5"
>

<div className="flex items-start gap-3">

<input
type="checkbox"
checked={selected.includes(tx.id)}
onChange={()=>{

if(selected.includes(tx.id)){
setSelected(prev => prev.filter(id => id !== tx.id))
}else{
setSelected(prev => [...prev, tx.id])
}

}}
/>

<div>

<p className="font-medium text-slate-800">
{tx.description}
</p>

<p className="text-xs text-slate-400">
{new Date(tx.date).toLocaleDateString()}
</p>

</div>

</div>

<div
className={`font-semibold ${
positive ? "text-green-600" : "text-red-500"
}`}
>
{positive ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
</div>

</div>

)

})}

</div>

</div>

)}


{/* ================= BUSINESS ================= */}

{activeTab === "business" && (

<div className="space-y-10 max-w-5xl">

{/* REVENUE */}

<div className="bg-white p-8 rounded-3xl shadow">

<h2 className="text-lg font-semibold mb-6">
Revenue
</h2>

<div className="grid grid-cols-2 gap-6">

{categories
.filter(c=>c.isRevenue)
.map(cat => (

<div
key={cat.id}
className="border rounded-xl p-4"
>

<div className="flex justify-between mb-2">

<p className="text-sm font-medium">
{cat.name}
</p>

<span className="text-slate-400">
•••
</span>

</div>

<input
className="w-full border rounded-md px-3 py-2 mb-2"
value={values[cat.id] || ""}
onChange={(e)=>
setValues(prev=>({
...prev,
[cat.id]:e.target.value
}))
}
/>

<button
onClick={()=>deleteCategory(cat.id)}
className="text-red-500 text-sm"
>
Delete
</button>

</div>

))}

</div>

</div>


{/* EXPENSES */}

<div className="bg-white p-8 rounded-3xl shadow">

<h2 className="text-lg font-semibold mb-6">
Expenses
</h2>

<div className="grid grid-cols-2 gap-6">

{categories
.filter(c=>!c.isRevenue)
.map(cat => (

<div
key={cat.id}
className="border rounded-xl p-4"
>

<div className="flex justify-between mb-2">

<p className="text-sm font-medium">
{cat.name}
</p>

<span className="text-slate-400">
•••
</span>

</div>

<input
className="w-full border rounded-md px-3 py-2 mb-2"
value={values[cat.id] || ""}
onChange={(e)=>
setValues(prev=>({
...prev,
[cat.id]:e.target.value
}))
}
/>

<button
onClick={()=>deleteCategory(cat.id)}
className="text-red-500 text-sm"
>
Delete
</button>

</div>

))}

</div>

</div>


{/* CREATE CATEGORY */}

<div className="bg-white p-6 rounded-2xl shadow flex gap-3">

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

<option value="Expense">
Expense
</option>

<option value="Revenue">
Revenue
</option>

</select>

<button
onClick={createCategory}
className="bg-red-500 text-white px-4 py-2 rounded-lg"
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


{/* ================= BILLING ================= */}

{activeTab === "billing" && (

<div className="max-w-4xl">
<Billing />
</div>

)}

{/* ================= ASK AI ================= */}

{activeTab === "askai" && (

<div className="max-w-3xl space-y-6">

<h1 className="text-2xl font-semibold text-slate-800">
Ask AI
</h1>

<div className="bg-white rounded-2xl shadow p-6 space-y-4">

<p className="text-slate-500 text-sm">
Ask Albdy AI about your business finances.
</p>

<textarea
placeholder="Example: How can I reduce my expenses?"
className="w-full border rounded-lg px-4 py-3 h-32"
/>

<button className="bg-red-500 text-white px-5 py-2 rounded-lg">
Ask AI
</button>

</div>

</div>

)}

{/* ================= SETTINGS ================= */}

{activeTab === "settings" && (

<div className="max-w-3xl space-y-8">

<h1 className="text-2xl font-semibold text-slate-800">
Settings
</h1>


{/* PROFILE */}

<section className="bg-white rounded-2xl shadow p-8 space-y-5">

<h2 className="text-lg font-semibold">
Profile
</h2>

<p className="text-sm text-slate-500">
Manage your account information and preferences.
</p>

<input
value="albdyfinancial@gmail.com"
readOnly
className="w-full border border-slate-200 rounded-lg px-4 py-3"
/>

<input
placeholder="Business Name"
className="w-full border border-slate-200 rounded-lg px-4 py-3"
/>

<select className="w-full border border-slate-200 rounded-lg px-4 py-3">

<option value="USD">USD</option>
<option value="EUR">EUR</option>
<option value="GBP">GBP</option>

</select>

<button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg">
Save Profile
</button>

</section>


{/* SECURITY */}

<section className="bg-white rounded-2xl shadow p-8 space-y-5">

<h2 className="text-lg font-semibold">
Security
</h2>

<p className="text-sm text-slate-500">
Update your password and secure your account.
</p>

<input
type="password"
placeholder="Current Password"
className="w-full border border-slate-200 rounded-lg px-4 py-3"
/>

<input
type="password"
placeholder="New Password"
className="w-full border border-slate-200 rounded-lg px-4 py-3"
/>

<input
type="password"
placeholder="Confirm Password"
className="w-full border border-slate-200 rounded-lg px-4 py-3"
/>

<button className="bg-black text-white px-5 py-2 rounded-lg">
Update Password
</button>

</section>


{/* ACCOUNT */}

<section className="bg-white rounded-2xl shadow p-8 space-y-4">

<h2 className="text-lg font-semibold">
Account
</h2>

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


{/* DANGER ZONE */}

<section className="bg-red-50 border border-red-200 rounded-2xl shadow p-8 space-y-4">

<h2 className="text-lg font-semibold text-red-600">
Danger Zone
</h2>

<p className="text-sm text-red-500">
Deleting your account permanently removes all financial data.
</p>

<button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg">
Delete Account
</button>

</section>

</div>

)}

</main>

</div>

)

}