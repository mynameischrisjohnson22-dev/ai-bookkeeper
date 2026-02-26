"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"

interface Category {
  id: string
  name: string
  type: "revenue" | "expense"
}

export default function BusinessPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [categoryType, setCategoryType] = useState<"revenue" | "expense">("expense")

  const [numbers, setNumbers] = useState({
    expenses: "",
    dividends: "",
    freelance: "",
    investments: "",
    salary: "",
    other: ""
  })

  // =========================
  // LOAD CATEGORIES
  // =========================
  const loadCategories = async () => {
    try {
      const res = await api.get("/api/categories")
      setCategories(res.data)
    } catch (err) {
      console.error("Failed to load categories", err)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // =========================
  // CREATE CATEGORY
  // =========================
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return

    try {
      await api.post("/api/categories", {
        name: newCategory,
        type: categoryType
      })

      setNewCategory("")
      loadCategories()
    } catch (err) {
      console.error("Failed to create category", err)
    }
  }

  // =========================
  // BUSINESS NUMBERS
  // =========================
  const handleChange = (e: any) => {
    setNumbers({ ...numbers, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    localStorage.setItem("businessNumbers", JSON.stringify(numbers))
    alert("Business numbers saved.")
  }

  const handleRemove = () => {
    localStorage.removeItem("businessNumbers")
    setNumbers({
      expenses: "",
      dividends: "",
      freelance: "",
      investments: "",
      salary: "",
      other: ""
    })
    alert("Business numbers removed.")
  }

  const revenueCategories = categories.filter(c => c.type === "revenue")
  const expenseCategories = categories.filter(c => c.type === "expense")

  return (
    <div className="min-h-screen p-10 bg-white text-black">

      <h1 className="text-3xl font-bold mb-6">Business</h1>

      {/* ================= Revenue ================= */}
      <h2 className="text-xl font-semibold mb-2">Revenue</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {revenueCategories.map(cat => (
          <div
            key={cat.id}
            className="px-4 py-2 bg-green-100 rounded-md"
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* ================= Expenses ================= */}
      <h2 className="text-xl font-semibold mb-2">Expenses</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {expenseCategories.map(cat => (
          <div
            key={cat.id}
            className="px-4 py-2 bg-red-100 rounded-md"
          >
            {cat.name}
          </div>
        ))}
      </div>

      <hr className="my-8" />

      {/* ================= Create Category ================= */}
      <h3 className="text-lg font-semibold mb-3">Create Category</h3>

      <div className="flex gap-4 mb-6">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category name"
          className="border px-4 py-2 rounded-md w-60"
        />

        <select
          value={categoryType}
          onChange={(e) =>
            setCategoryType(e.target.value as "revenue" | "expense")
          }
          className="border px-4 py-2 rounded-md"
        >
          <option value="expense">Expense</option>
          <option value="revenue">Revenue</option>
        </select>

        <button
          onClick={handleCreateCategory}
          className="bg-red-600 text-white px-6 py-2 rounded-md"
        >
          Create
        </button>
      </div>

      {/* ================= Business Numbers ================= */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-red-600 text-white px-6 py-2 rounded-md"
        >
          Save Business Numbers
        </button>

        <button
          onClick={handleRemove}
          className="bg-red-500 text-white px-6 py-2 rounded-md"
        >
          Remove Business Numbers
        </button>
      </div>
    </div>
  )
}