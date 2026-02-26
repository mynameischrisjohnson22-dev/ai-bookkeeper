"use client"

import { useEffect, useMemo, useState } from "react"
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
  parent: string
  isRevenue: boolean
}

type Tab =
  | "dashboard"
  | "transactions"
  | "business"
  | "billing"
  | "askai"

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState("")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryType, setNewCategoryType] =
    useState<"Revenue" | "Expense">("Expense")

  /* ================= LOAD ================= */

  const loadData = async () => {
    try {
      const [txRes, catRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/categories"),
      ])

      setTransactions(txRes.data || [])
      setCategories(catRes.data || [])
    } catch (err) {
      console.error("Failed to load data", err)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/auth/login"
    } else {
      loadData()
    }
  }, [])

  /* ================= CATEGORY ================= */

  const createCategory = async () => {
    if (!newCategoryName.trim()) return

    await api.post("/categories", {
      name: newCategoryName,
      parent: newCategoryType,
      isRevenue: newCategoryType === "Revenue",
    })

    setNewCategoryName("")
    await loadData()
  }

  const deleteCategory = async (id: string) => {
    await api.delete(`/categories/${id}`)
    await loadData()
  }

  /* ================= BUSINESS SAVE ================= */

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
      entries.map((entry) => api.post("/transactions", entry))
    )

    setValues({})
    await loadData()
    setActiveTab("transactions")
  }

  const resetBusiness = async () => {
    await api.delete("/transactions/business/reset")
    await loadData()
  }

  /* ================= CALCULATIONS ================= */

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

  const tabs = [
    { key: "dashboard", label: "Overview" },
    { key: "transactions", label: "Transactions" },
    { key: "business", label: "Business" },
    { key: "billing", label: "Billing" },
    { key: "askai", label: "Ask AI" },
  ] as { key: Tab; label: string }[]

  return (
    <div className="bg-white min-h-screen flex">

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} border-r p-6 transition-all`}>
        <div className="flex justify-between mb-10">
          {sidebarOpen && (
            <h2 className="text-red-600 font-semibold text-lg">
              AI Bookkeeper
            </h2>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                activeTab === tab.key
                  ? "bg-red-600 text-white"
                  : "text-slate-600 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              {sidebarOpen ? tab.label : tab.label[0]}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 px-16 py-14 space-y-12">

        <h1 className="text-2xl font-semibold">
          {tabs.find((t) => t.key === activeTab)?.label}
        </h1>

        {/* ================= OVERVIEW ================= */}
        {activeTab === "dashboard" && (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              <StatCard label="Income" value={income} />
              <StatCard label="Expenses" value={Math.abs(expenses)} />
              <StatCard label="Balance" value={balance} />
            </div>

            <div className="bg-white p-8 rounded-2xl border shadow-sm">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ================= TRANSACTIONS ================= */}
        {activeTab === "transactions" && (
          <div className="space-y-6 max-w-3xl">
            <input
              placeholder="Search transactions"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded-md w-full"
            />

            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 border rounded-lg flex justify-between">
                <div>
                  <div className="font-medium">{tx.description}</div>
                  <div className="text-sm text-slate-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </div>
                </div>
                <div className={tx.amount > 0 ? "text-green-600" : "text-red-600"}>
                  ${tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= BUSINESS ================= */}
        {activeTab === "business" && (
          <div className="space-y-10 max-w-5xl">

            {/* REVENUE */}
            <SectionGrid
              title="Revenue"
              categories={categories.filter((c) => c.isRevenue)}
              values={values}
              setValues={setValues}
              deleteCategory={deleteCategory}
            />

            {/* EXPENSES */}
            <SectionGrid
              title="Expenses"
              categories={categories.filter((c) => !c.isRevenue)}
              values={values}
              setValues={setValues}
              deleteCategory={deleteCategory}
            />

            {/* CREATE CATEGORY */}
            <div className="border-t pt-8 space-y-4">
              <h3 className="text-lg font-semibold">Create Category</h3>
              <div className="flex gap-4">
                <input
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="border px-4 py-2 rounded-md"
                />
                <select
                  value={newCategoryType}
                  onChange={(e) =>
                    setNewCategoryType(e.target.value as "Revenue" | "Expense")
                  }
                  className="border px-4 py-2 rounded-md"
                >
                  <option value="Expense">Expense</option>
                  <option value="Revenue">Revenue</option>
                </select>
                <button
                  onClick={createCategory}
                  className="bg-red-600 text-white px-6 py-2 rounded-md"
                >
                  Create
                </button>
              </div>
            </div>

            {/* SAVE / REMOVE */}
            <div className="flex gap-4">
              <button
                onClick={saveBusiness}
                className="bg-red-600 text-white px-6 py-2 rounded-md"
              >
                Save Business Numbers
              </button>
              <button
                onClick={resetBusiness}
                className="bg-red-500 text-white px-6 py-2 rounded-md"
              >
                Remove Business Numbers
              </button>
            </div>
          </div>
        )}

        {/* ================= BILLING ================= */}
        {activeTab === "billing" && (
          <div className="p-8 border rounded-xl">
            Billing system coming soon.
          </div>
        )}

        {/* ================= ASK AI ================= */}
        {activeTab === "askai" && (
          <div className="p-8 border rounded-xl">
            <ChatBox />
          </div>
        )}

      </main>
    </div>
  )
}

/* ================= HELPER COMPONENTS ================= */

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-8 rounded-xl border shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-semibold">
        ${value.toFixed(2)}
      </div>
    </div>
  )
}

function SectionGrid({
  title,
  categories,
  values,
  setValues,
  deleteCategory,
}: any) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat: any) => (
          <div key={cat.id} className="border p-4 rounded-lg space-y-2">
            <label className="text-sm text-slate-500">{cat.name}</label>
            <input
              type="number"
              value={values[cat.id] ?? ""}
              onChange={(e) =>
                setValues((prev: any) => ({
                  ...prev,
                  [cat.id]: e.target.value,
                }))
              }
              className="w-full border p-2 rounded-md"
            />
            <button
              onClick={() => deleteCategory(cat.id)}
              className="text-sm text-red-600"
            >
              Delete Category
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}