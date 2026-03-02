"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import ChatBox from "@/components/ChatBox"
import {
  LineChart,
  Line,
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
}

type Tab =
  | "dashboard"
  | "transactions"
  | "business"
  | "billing"
  | "askai"

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

  const loadData = async () => {
    try {
      const [txRes, catRes] = await Promise.all([
        api.get("/api/transactions"),
        api.get("/api/categories"),
      ])

      setTransactions(txRes.data || [])

      const normalized = (catRes.data || []).map((c: any) => ({
        ...c,
        isRevenue: Boolean(c.isRevenue),
      }))

      setCategories(normalized)
    } catch (err) {
      console.error("Failed to load data", err)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }
    loadData()
  }, [])

  const createCategory = async () => {
    if (!newCategoryName.trim()) return

    await api.post("/api/categories", {
      name: newCategoryName,
      isRevenue: newCategoryType === "Revenue",
    })

    setNewCategoryName("")
    await loadData()
  }

  const deleteCategory = async (id: string) => {
    await api.delete(`/api/categories/${id}`)
    await loadData()
  }

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
    await loadData()
    setActiveTab("transactions")
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) =>
      t.description.toLowerCase().includes(search.toLowerCase())
    )
  }, [transactions, search])

  const income = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income + expenses

  const chartData = filteredTransactions.map((t) => ({
    date: new Date(t.date).toLocaleDateString(),
    income: t.amount > 0 ? t.amount : 0,
    expense: t.amount < 0 ? Math.abs(t.amount) : 0,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white/80 backdrop-blur border-r border-slate-100 p-8">
        <h2 className="text-red-500 font-bold text-xl mb-12">
          Albdy
        </h2>

        {["dashboard","transactions","business","billing","askai"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all ${
              activeTab === tab
                ? "bg-red-500 text-white shadow-md"
                : "text-slate-600 hover:bg-indigo-50 hover:text-red-500"
            }`}
          >
            {tab === "dashboard" && "Overview"}
            {tab === "transactions" && "Transactions"}
            {tab === "business" && "Business"}
            {tab === "billing" && "Billing"}
            {tab === "askai" && "Ask AI"}
          </button>
        ))}
      </aside>

      {/* MAIN */}
      <main className="flex-1 px-16 py-14 space-y-14">

        {activeTab === "dashboard" && (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              <StatCard label="Income" value={income} positive />
              <StatCard label="Expenses" value={Math.abs(expenses)} negative />
              <StatCard label="Balance" value={balance} highlight />
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === "transactions" && (
          <div className="max-w-3xl space-y-6">
            <input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-white shadow-sm border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <div className="bg-white rounded-2xl shadow-sm divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition"
                >
                  <div>
                    <div className="font-medium text-slate-800">
                      {tx.description}
                    </div>
                    <div className="text-sm text-slate-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div
                    className={`font-semibold ${
                      tx.amount > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "-"}$
                    {Math.abs(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "business" && (
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

        {activeTab === "askai" && <ChatBox />}

      </main>
    </div>
  )
}

/* COMPONENTS */

function StatCard({
  label,
  value,
  positive,
  negative,
  highlight,
}: any) {
  return (
    <div
      className={`p-8 rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 ${
        highlight ? "ring-2 ring-red-500" : ""
      }`}
    >
      <div className="text-sm text-slate-400 mb-2">{label}</div>
      <div
        className={`text-3xl font-bold ${
          positive
            ? "text-green-600"
            : negative
            ? "text-red-500"
            : "text-slate-800"
        }`}
      >
        ${value.toFixed(2)}
      </div>
    </div>
  )
}

function BusinessSection(props: any) {
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

  return (
    <div className="space-y-14 max-w-6xl">

      {["Revenue","Expenses"].map((section) => {
        const isRevenue = section === "Revenue"

        const filtered = categories.filter(
          (c: any) => c.isRevenue === isRevenue
        )

        return (
          <div
            key={section}
            className="bg-white p-8 rounded-3xl shadow-md"
          >
            <h2 className="text-xl font-semibold mb-6 text-slate-800">
              {section}
            </h2>

            <div className="flex flex-wrap gap-4">
              {filtered.map((cat: any) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl shadow-sm"
                >
                  <span className="text-sm text-slate-700">
                    {cat.name}
                  </span>
                  <input
                    type="number"
                    value={values[cat.id] ?? ""}
                    onChange={(e) =>
                      setValues((prev: any) => ({
                        ...prev,
                        [cat.id]: e.target.value,
                      }))
                    }
                    className="w-24 px-2 py-1 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="bg-white p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-xl font-semibold">Create Category</h3>

        <div className="flex gap-4">
          <input
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <select
            value={newCategoryType}
            onChange={(e) =>
              setNewCategoryType(e.target.value as "Revenue" | "Expense")
            }
            className="px-4 py-2 rounded-xl border border-slate-200"
          >
            <option value="Expense">Expense</option>
            <option value="Revenue">Revenue</option>
          </select>
          <button
            onClick={createCategory}
            className="bg-red-500 text-white px-6 py-2 rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Create
          </button>
        </div>

        <button
          onClick={saveBusiness}
          className="bg-red-500 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition"
        >
          Save Configuration
        </button>
      </div>

    </div>
  )
}