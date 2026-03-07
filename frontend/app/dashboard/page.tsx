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
  CartesianGrid,
} from "recharts"

type Transaction = {
  id: string
  date: string
  description: string
  amount: number
}

type Category = {
  id: string
  name: string
  isRevenue: boolean
  isRecurring?: boolean
  recurringFrequency?: string
}

type Tab =
  | "dashboard"
  | "transactions"
  | "business"
  | "billing"
  | "askai"
  | "settings"

export default function Dashboard() {
  const router = useRouter()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [search, setSearch] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryType, setNewCategoryType] =
    useState<"Revenue" | "Expense">("Expense")
  const [selected, setSelected] = useState<string[]>([])

  /* LOAD DATA */

  const loadData = async () => {
    const [txRes, catRes] = await Promise.all([
      api.get("/api/transactions"),
      api.get("/api/categories"),
    ])

    setTransactions(txRes.data || [])
    setCategories(catRes.data || [])
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/auth/login")
      return
    }

    loadData()
  }, [])

  /* CATEGORY */

  const createCategory = async () => {
    if (!newCategoryName.trim()) return

    await api.post("/api/categories", {
      name: newCategoryName,
      isRevenue: newCategoryType === "Revenue",
    })

    setNewCategoryName("")
    loadData()
  }

  const deleteCategory = async (id: string) => {
    await api.delete(`/api/categories/${id}`)
    loadData()
  }

  /* SAVE BUSINESS */

  const saveBusiness = async () => {
    const today = new Date().toISOString()

    const entries = categories
      .map((cat) => {
        const raw = values[cat.id]
        if (!raw) return null

        const value = Number(raw)
        if (isNaN(value)) return null

        return {
          date: today,
          description: cat.name,
          amount: cat.isRevenue ? value : -Math.abs(value),
          categoryId: cat.id,
        }
      })
      .filter(Boolean)

    await Promise.all(
      entries.map((entry) => api.post("/api/transactions", entry))
    )

    setValues({})
    loadData()
    setActiveTab("transactions")
  }

  /* DELETE TRANSACTIONS */

  const deleteTransactions = async () => {
    if (selected.length === 0) return

    await Promise.all(
      selected.map((id) => api.delete(`/api/transactions/${id}`))
    )

    setSelected([])
    loadData()
  }

  /* FILTER */

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) =>
      t.description.toLowerCase().includes(search.toLowerCase())
    )
  }, [transactions, search])

  const income = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0)

  const expenses = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + t.amount, 0)

  const balance = income + expenses

  /* CHART */

  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {}

    filteredTransactions.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString()

      if (!grouped[date]) grouped[date] = 0

      grouped[date] += t.amount
    })

    const dates = Object.keys(grouped).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )

    let running = 0

    return dates.map((d) => {
      running += grouped[d]

      return {
        date: d,
        balance: running,
      }
    })
  }, [filteredTransactions])

  /* UI */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">

      {/* SIDEBAR */}

      <aside className="w-64 bg-white border-r p-8">
        <h2 className="text-red-500 font-bold text-xl mb-10">Albdy</h2>

        {["dashboard","transactions","business","billing","askai","settings"].map((tab)=>(
          <button
            key={tab}
            onClick={()=>{
              if(tab==="settings") router.push("/settings")
              else setActiveTab(tab as Tab)
            }}
            className={`w-full text-left px-4 py-3 rounded-xl mb-2 ${
              activeTab===tab
                ? "bg-red-500 text-white"
                : "text-slate-600 hover:bg-indigo-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </aside>

      {/* MAIN */}

      <main className="flex-1 px-16 py-14 space-y-14">

        {/* DASHBOARD */}

        {activeTab==="dashboard" && (
          <div className="space-y-10 max-w-3xl">

            <div className="bg-white p-10 rounded-3xl shadow">
              <div className="text-sm text-slate-500">Current Balance</div>
              <div className="text-4xl font-bold">${balance.toFixed(2)}</div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                <Line dataKey="balance" stroke="#dc2626" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>

          </div>
        )}

        {/* TRANSACTIONS */}

        {activeTab==="transactions" && (
          <div className="max-w-3xl space-y-6">

            <input
              placeholder="Search transactions..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl"
            />

            {filteredTransactions.map((tx)=>{

              const isSelected = selected.includes(tx.id)

              return (
                <div
                  key={tx.id}
                  className="flex justify-between px-6 py-4 bg-white rounded-xl shadow"
                >

                  <div className="flex gap-3 items-center">

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={()=>{
                        if(isSelected)
                          setSelected((p)=>p.filter((id)=>id!==tx.id))
                        else
                          setSelected((p)=>[...p,tx.id])
                      }}
                    />

                    <div>
                      <div>{tx.description}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(tx.date).toLocaleDateString()}
                      </div>
                    </div>

                  </div>

                  <div>
                    {tx.amount>0?"+":"-"}${Math.abs(tx.amount).toFixed(2)}
                  </div>

                </div>
              )
            })}

          </div>
        )}

        {/* BUSINESS */}

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

/* BUSINESS SECTION */

function BusinessSection(props:any){

  const {
    categories,
    values,
    setValues,
    deleteCategory,
    newCategoryName,
    setNewCategoryName,
    newCategoryType,
    setNewCategoryType,
    createCategory,
    saveBusiness,
  } = props

  const [editingCategory,setEditingCategory] = useState<any>(null)

  return (
    <>
      <div className="space-y-10 max-w-4xl">

        {["Revenue","Expenses"].map((section)=>{

          const isRevenue = section==="Revenue"

          const filtered = categories.filter(
            (c:any)=>c.isRevenue===isRevenue
          )

          return (
            <div key={section} className="bg-white p-10 rounded-xl shadow">

              <h2 className="text-xl font-semibold mb-6">{section}</h2>

              {filtered.map((cat:any)=>(
                <div key={cat.id} className="flex items-center gap-4 mb-4">

                  <span className="w-40">{cat.name}</span>

                  <input
                    type="number"
                    value={values[cat.id] ?? ""}
                    onChange={(e)=>
                      setValues((prev:any)=>({
                        ...prev,
                        [cat.id]:e.target.value
                      }))
                    }
                    className="border px-3 py-2 rounded"
                  />

                  <button
                    onClick={()=>deleteCategory(cat.id)}
                    className="text-red-500"
                  >
                    ×
                  </button>

                  <button
                    onClick={()=>setEditingCategory(cat)}
                    className="text-slate-400"
                  >
                    ⋯
                  </button>

                </div>
              ))}

            </div>
          )
        })}

        {/* CREATE CATEGORY */}

        <div className="bg-white p-8 rounded-xl shadow space-y-4">

          <input
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e)=>setNewCategoryName(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <select
            value={newCategoryType}
            onChange={(e)=>setNewCategoryType(e.target.value)}
            className="border px-3 py-2 rounded"
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

      {/* MODAL */}

      {editingCategory && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h2 className="text-lg font-semibold mb-4">Category Settings</h2>

            <button
              onClick={()=>setEditingCategory(null)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>
      )}
    </>
  )
}