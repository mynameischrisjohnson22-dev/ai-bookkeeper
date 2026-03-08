"use client"

import { useEffect, useMemo, useState } from "react"
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

function SettingsContent() {
  return (
    <div className="space-y-10">

      <div className="bg-white p-8 rounded-xl border">
        <h3 className="text-lg font-semibold mb-4">Profile</h3>

        <input
          placeholder="Business name"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <select className="w-full border rounded px-3 py-2">
          <option>USD</option>
          <option>EUR</option>
        </select>
      </div>

      <div className="bg-white p-8 rounded-xl border">
        <h3 className="text-lg font-semibold mb-4">Security</h3>

        <input
          type="password"
          placeholder="New password"
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border rounded px-3 py-2"
        />
      </div>

    </div>
  )
}

/* ================= TYPES ================= */

type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  isRecurring?: boolean
  recurringFrequency?: string
}

type Category = {
  id: string
  name: string
  isRevenue: boolean
  isRecurring?: boolean
  recurringAmount?: number
  recurringFrequency?: string
}

type Tab =
  | "dashboard"
  | "transactions"
  | "business"
  | "billing"
  | "askai"

/* ================= DASHBOARD ================= */

export default function Dashboard() {

  const router = useRouter()

  /* ================= STATE ================= */

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [values, setValues] = useState<Record<string, string>>({})

  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [search, setSearch] = useState("")

  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryType, setNewCategoryType] =
    useState<"Revenue" | "Expense">("Expense")

  const [settingsOpen, setSettingsOpen] = useState(false)

  const [selected, setSelected] = useState<string[]>([])

  /* ================= LOAD ================= */

  const loadData = async () => {

    try{

      const [txRes,catRes] = await Promise.all([
        api.get("/api/transactions"),
        api.get("/api/categories")
      ])

      setTransactions(txRes.data || [])

      const normalized = (catRes.data || []).map((c:any)=>({
        ...c,
        isRevenue:Boolean(c.isRevenue)
      }))

      setCategories(normalized)

    }catch(err){
      console.error("Failed to load data",err)
    }

  }

  useEffect(()=>{

    const token = localStorage.getItem("token")

    if(!token){
      router.push("/auth/login")
      return
    }

    loadData()

  },[])

  /* ================= CATEGORY ================= */

  const createCategory = async ()=>{

    if(!newCategoryName.trim()) return

    await api.post("/api/categories",{
      name:newCategoryName,
      isRevenue:newCategoryType === "Revenue"
    })

    setNewCategoryName("")
    await loadData()

  }

  const deleteCategory = async(id:string)=>{

    await api.delete(`/api/categories/${id}`)
    await loadData()

  }

  /* ================= BUSINESS SAVE ================= */

  const saveBusiness = async ()=>{

    const today = new Date().toISOString()

    const entries = categories
      .map(cat=>{

        const raw = values[cat.id]
        if(!raw) return null

        const value = Number(raw)
        if(isNaN(value)) return null

        return {
          date: today,
          description: cat.name,
          amount: cat.isRevenue ? value : -Math.abs(value),
          categoryId: cat.id,
          isRecurring: cat.isRecurring || false,
          recurringFrequency: cat.recurringFrequency || null
        }

      })
      .filter(Boolean)

    await Promise.all(
      entries.map(entry=>api.post("/api/transactions",entry))
    )

    setValues({})
    await loadData()
    setActiveTab("transactions")

  }

  const deleteTransactions = async ()=>{

    if(selected.length===0) return

    await Promise.all(
      selected.map(id=>api.delete(`/api/transactions/${id}`))
    )

    setSelected([])
    await loadData()

  }

  /* ================= FILTER ================= */

  const filteredTransactions = useMemo(()=>{

    return transactions.filter(t=>
      t.description.toLowerCase().includes(search.toLowerCase())
    )

  },[transactions,search])

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

    const sortedDates = Object.keys(grouped).sort(
      (a,b)=>new Date(a).getTime()-new Date(b).getTime()
    )

    let runningBalance = 0

    return sortedDates.map(date=>{

      runningBalance += grouped[date]

      return{
        date,
        balance:runningBalance
      }

    })

  },[filteredTransactions])

  /* ================= UI ================= */

  return(

<div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">

{/* SIDEBAR */}

<aside className="w-64 bg-white/80 backdrop-blur border-r border-slate-100 p-8">

<h2 className="text-red-500 font-bold text-xl mb-12">
Albdy
</h2>

{["dashboard","transactions","business","billing","askai","settings"].map(tab=>(

<button
key={tab}
onClick={()=>{
if(tab==="settings"){
setSettingsOpen(true)
}else{
setActiveTab(tab as Tab)
}
}}
className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
activeTab===tab
? "bg-red-500 text-white shadow-md"
: "text-slate-600 hover:bg-indigo-50 hover:text-red-500"
}`}
>

{tab==="dashboard" && "Overview"}
{tab==="transactions" && "Transactions"}
{tab==="business" && "Business"}
{tab==="billing" && "Billing"}
{tab==="askai" && "Ask AI"}
{tab==="settings" && "Settings"}

</button>

))}

</aside>

{/* MAIN */}

<main className="flex-1 px-16 py-14 space-y-14">

{activeTab==="dashboard" && (

<>

<div className="bg-white p-10 rounded-3xl shadow-lg max-w-3xl">

<div className="text-sm text-slate-500 mb-2">
Current Balance
</div>

<div className={`text-4xl font-bold ${
balance>0
? "text-green-600"
: balance<0
? "text-red-600"
: "text-slate-800"
}`}>
${balance.toFixed(2)}
</div>

<div className="text-sm text-slate-400 mt-2">
Income minus expenses
</div>

</div>

<div className="grid md:grid-cols-2 gap-8 max-w-3xl">

<div className="bg-white p-8 rounded-2xl shadow-sm">
<div className="text-sm text-slate-500">Income</div>
<div className="text-2xl font-semibold text-green-600">
${income.toFixed(2)}
</div>
</div>

<div className="bg-white p-8 rounded-2xl shadow-sm">
<div className="text-sm text-slate-500">Expenses</div>
<div className="text-2xl font-semibold text-red-600">
${Math.abs(expenses).toFixed(2)}
</div>
</div>

</div>

<div className="bg-white p-10 rounded-3xl shadow-lg">

<h2 className="text-lg font-semibold mb-6">
Financial Overview
</h2>

<ResponsiveContainer width="100%" height={340}>

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
dot={false}
/>

<Area
type="monotone"
dataKey="balance"
stroke="none"
fill="#fecaca"
/>

</LineChart>

</ResponsiveContainer>

</div>

</>

)}

{activeTab==="transactions" && (

<div className="max-w-3xl space-y-6">

<input
placeholder="Search transactions..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full px-5 py-3 rounded-xl bg-white shadow-sm border"
/>

{selected.length > 0 && (

<button
onClick={deleteTransactions}
className="bg-red-500 text-white px-4 py-2 rounded-lg"
>
Delete
</button>

)}

<div className="bg-white rounded-2xl shadow-sm divide-y">

{filteredTransactions.map((tx)=>{

const isSelected = selected.includes(tx.id)

return(

<div
key={tx.id}
className="flex justify-between items-center px-6 py-4 hover:bg-slate-50"
>

<div className="flex items-center gap-4">

<input
type="checkbox"
checked={isSelected}
onChange={()=>{
if(isSelected){
setSelected(prev=>prev.filter(id=>id!==tx.id))
}else{
setSelected(prev=>[...prev,tx.id])
}
}}
/>

<div>

<div className="flex items-center gap-2">

{tx.isRecurring && (
<span
className="w-2 h-2 rounded-full bg-green-500"
title="Recurring"
/>
)}

<div className="font-medium">
{tx.description}
</div>

{tx.isRecurring && tx.recurringFrequency && (
<span className="text-xs text-green-600 capitalize">
{tx.recurringFrequency} recurring
</span>
)}

</div>

<div className="text-xs text-slate-400">
{new Date(tx.date).toLocaleDateString()}
</div>

</div>

</div>

<div className={tx.amount>0 ? "text-green-600" : "text-red-500"}>
{tx.amount>0?"+":"-"}${Math.abs(tx.amount).toFixed(2)}
</div>

</div>

)

})}

</div>

</div>

)}

{activeTab==="business" && (

<BusinessSection
categories={categories}
values={values}
setValues={setValues}
deleteCategory={deleteCategory}
newCategoryName={newCategoryName}
setNewCategoryName={setNewCategoryName}
newCategoryType={newCategoryType}
setNewCategoryType={setNewCategoryType}
createCategory={createCategory}
saveBusiness={saveBusiness}
/>

)}

{activeTab === "billing" && <Billing />}
{activeTab === "askai" && <ChatBox />}

</main>

{/* SETTINGS MODAL */}

{settingsOpen && (
<div className="fixed inset-0 z-50 flex items-center justify-center">

<div
className="absolute inset-0 bg-black/40 backdrop-blur-sm"
onClick={()=>setSettingsOpen(false)}
/>

<div className="relative bg-white w-[720px] max-h-[85vh] overflow-y-auto rounded-2xl p-8 shadow-xl">

<div className="flex justify-between items-center mb-6">

<h2 className="text-xl font-semibold">
Settings
</h2>

<button
onClick={()=>setSettingsOpen(false)}
className="text-slate-400 hover:text-slate-700 text-lg"
>
✕
</button>

</div>

<SettingsContent/>

</div>

</div>
)}

</div>

)

}

/* ================= BUSINESS SECTION ================= */

function BusinessSection(props:any){

  const [editingCategory,setEditingCategory] = useState<any | null>(null)

  const{
    categories,
    values,
    setValues,
    deleteCategory,
    newCategoryName,
    setNewCategoryName,
    newCategoryType,
    setNewCategoryType,
    createCategory,
    saveBusiness
  } = props

  return(

    <div className="space-y-10 max-w-4xl">

      {["Revenue","Expenses"].map(section=>{

        const isRevenue = section === "Revenue"

        const filtered = categories.filter(
          (c:any)=>c.isRevenue === isRevenue
        )

        return(

          <div key={section} className="bg-white p-10 rounded-2xl shadow-sm">

            <h2 className="text-xl font-semibold mb-10">
              {section}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {filtered.map((cat:any)=>(

                <div
                  key={cat.id}
                  className="bg-slate-50 border rounded-xl px-6 py-5"
                >

                  <div className="flex justify-between items-center">

                    <span className="text-sm font-medium">
                      {cat.name}
                    </span>

                    <button
                      onClick={()=>setEditingCategory(cat)}
                      className="text-slate-400 hover:text-slate-700 text-lg"
                    >
                      ⋯
                    </button>

                  </div>

                  <input
                    type="number"
                    value={values[cat.id] ?? ""}
                    onChange={(e)=>
                      setValues((prev:any)=>({
                        ...prev,
                        [cat.id]:e.target.value
                      }))
                    }
                    className="w-full border rounded px-3 py-2 mt-3"
                  />

                  <button
                    onClick={()=>deleteCategory(cat.id)}
                    className="mt-3 text-red-500"
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          </div>

        )

      })}

      <div className="bg-white p-10 rounded-2xl shadow-sm space-y-6">

        <div className="flex gap-4 flex-wrap">

          <input
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e)=>setNewCategoryName(e.target.value)}
            className="border px-4 py-2 rounded"
          />

          <select
            value={newCategoryType}
            onChange={(e)=>
              setNewCategoryType(e.target.value as "Revenue"|"Expense")
            }
            className="border px-4 py-2 rounded"
          >
            <option value="Expense">Expense</option>
            <option value="Revenue">Revenue</option>
          </select>

          <button
            onClick={createCategory}
            className="bg-red-500 text-white px-6 py-2 rounded"
          >
            Create
          </button>

          <button
            onClick={saveBusiness}
            className="bg-red-500 text-white px-8 py-3 rounded"
          >
            Save Configuration
          </button>

        </div>

      </div>

    </div>

  )

}