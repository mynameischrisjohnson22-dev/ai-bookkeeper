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
  isRecurring?: boolean
  recurringFrequency?: string
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

export default function Dashboard() {

  const router = useRouter()

  /* ================= AUTH STATE ================= */

  const [tokenReady,setTokenReady] = useState(false)

  /* ================= DATA ================= */

  const [transactions,setTransactions] = useState<Transaction[]>([])
  const [categories,setCategories] = useState<Category[]>([])

  const [values,setValues] = useState<Record<string,string>>({})

  /* ================= UI ================= */

  const [activeTab,setActiveTab] = useState<Tab>("dashboard")
  const [search,setSearch] = useState("")
  const [settingsOpen,setSettingsOpen] = useState(false)

  const [selected,setSelected] = useState<string[]>([])

  const [newCategoryName,setNewCategoryName] = useState("")
  const [newCategoryType,setNewCategoryType] =
    useState<"Revenue"|"Expense">("Expense")

  /* ================= AUTH ================= */

  useEffect(()=>{

    if(typeof window==="undefined") return

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
    if(tokenReady){
      loadData()
    }
  },[tokenReady])

  if(!tokenReady){
    return null
  }

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

  /* ================= CATEGORY ================= */

  const createCategory = async ()=>{

    if(!newCategoryName.trim()) return

    await api.post("/api/categories",{
      name:newCategoryName,
      isRevenue:newCategoryType==="Revenue"
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
    await loadData()
    setActiveTab("transactions")

  }

  /* ================= DELETE TX ================= */

  const deleteTransactions = async ()=>{

    if(selected.length===0) return

    await Promise.all(
      selected.map(id=>api.delete(`/api/transactions/${id}`))
    )

    setSelected([])
    await loadData()

  }

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
className={`w-full text-left px-4 py-3 rounded-xl mb-2 ${
activeTab===tab
? "bg-red-500 text-white"
: "text-slate-600 hover:bg-indigo-50"
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

<div className="bg-white p-10 rounded-3xl shadow-lg">

<h2 className="text-lg font-semibold mb-6">
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

{activeTab==="transactions" && (

<div>

<input
placeholder="Search..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-4 py-2 mb-4"
/>

<button
onClick={deleteTransactions}
className="bg-red-500 text-white px-4 py-2 mb-4"
>
Delete Selected
</button>

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

<div>
${Math.abs(tx.amount).toFixed(2)}
</div>

</div>

))}

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

{activeTab==="billing" && <Billing/>}
{activeTab==="askai" && <ChatBox/>}

</main>

</div>

)

}

/* ================= BUSINESS SECTION ================= */

function BusinessSection(props:any){

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

<div>

<h2 className="text-xl font-semibold mb-6">
Business Configuration
</h2>

{categories.map((cat:any)=>(

<div key={cat.id} className="mb-4">

<label>{cat.name}</label>

<input
type="number"
value={values[cat.id] ?? ""}
onChange={(e)=>setValues((prev:any)=>({
...prev,
[cat.id]:e.target.value
}))}
/>

<button onClick={()=>deleteCategory(cat.id)}>
Delete
</button>

</div>

))}

<input
placeholder="Category name"
value={newCategoryName}
onChange={(e)=>setNewCategoryName(e.target.value)}
/>

<select
value={newCategoryType}
onChange={(e)=>setNewCategoryType(e.target.value as any)}
>
<option value="Expense">Expense</option>
<option value="Revenue">Revenue</option>
</select>

<button onClick={createCategory}>
Create
</button>

<button onClick={saveBusiness}>
Save Configuration
</button>

</div>

)

}