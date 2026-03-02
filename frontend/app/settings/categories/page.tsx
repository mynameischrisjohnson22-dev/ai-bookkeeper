"use client"

import { useEffect, useMemo, useState } from "react"
import api from "@/lib/api"

type Category = {
  id: string
  name: string
  icon?: string
  builtIn: boolean
  parent: string
  isRevenue: boolean
  isCOGS: boolean
}

export default function CategorySettingsPage() {
  const [cats, setCats] = useState<Category[]>([])

  // ================= LOAD =================
  const load = async () => {
    try {
      const res = await api.get("/api/categories")
      setCats(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error("Failed to load categories", err)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const builtIn = cats.filter(c => c.builtIn)
  const custom = cats.filter(c => !c.builtIn)

  const groups = useMemo(() => {
    const set = new Set<string>()
    builtIn.forEach(c => set.add(c.parent))

    if (set.size === 0) {
      return ["Income", "Expenses", "Other"]
    }

    return Array.from(set)
  }, [builtIn])

  // ================= ADD =================
  const addCategory = async () => {
    const name = prompt("Category name")
    if (!name) return

    const groupInput = prompt(
      `Which group?\n\n${groups.join(", ")}`
    )
    if (!groupInput) return

    const normalized = groupInput.trim().toLowerCase()

    const realParent = groups.find(
      g => g.toLowerCase() === normalized
    )

    if (!realParent) {
      alert("Invalid group")
      return
    }

    const icon = prompt("Icon (emoji)") || "📁"

    const isRevenue = realParent.toLowerCase() === "income"
    const isCOGS = realParent.toLowerCase() === "cogs"

    try {
      await api.post("/api/categories", {
        parent: realParent,
        name,
        icon,
        isRevenue,
        isCOGS,
      })

      await load()
    } catch (err) {
      console.error("Create category failed", err)
    }
  }

  // ================= DELETE =================
  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return

    try {
      await api.delete(`/api/categories/${id}`)
      await load()
    } catch (err) {
      console.error("Delete failed", err)
    }
  }

  // ================= RESET =================
  const reset = async () => {
    if (!confirm("Reset all custom categories?")) return

    try {
      await api.post("/api/categories/reset")
      await load()
    } catch (err) {
      console.error("Reset failed", err)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Category Settings</h1>

        <button
          onClick={addCategory}
          className="border px-3 py-1 rounded"
        >
          + Add
        </button>
      </div>

      <div>
        <h3 className="text-sm text-gray-500 mb-2">
          Predefined Categories
        </h3>

        <div className="border rounded divide-y">
          {builtIn.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-400">
              No predefined categories yet
            </div>
          )}

          {builtIn.map(c => (
            <div
              key={c.id}
              className="flex justify-between px-4 py-2 text-sm"
            >
              <div>
                {c.icon} {c.name}
                <span className="ml-2 text-xs text-gray-400">
                  ({c.parent})
                </span>
              </div>
              <span className="text-gray-400">Built-in</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm text-gray-500 mb-2">
          Custom Categories
        </h3>

        <div className="border rounded divide-y">
          {custom.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-400">
              No custom categories
            </div>
          )}

          {custom.map(c => (
            <div
              key={c.id}
              className="flex justify-between items-center px-4 py-2 text-sm"
            >
              <div>
                {c.icon} {c.name}
                <span className="ml-2 text-xs text-gray-400">
                  ({c.parent})
                </span>
              </div>

              <button
                onClick={() => remove(c.id)}
                className="text-red-500 text-xs"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={reset}
        className="w-full border border-red-300 text-red-600 rounded py-2"
      >
        Reset to defaults
      </button>

      <p className="text-xs text-gray-500">
        Built-in categories cannot be renamed or deleted.
      </p>
    </div>
  )
}