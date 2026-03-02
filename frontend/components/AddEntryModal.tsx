"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function AddEntryModal({
  open,
  onClose,
  onSaved,
}: any) {
  const [tab, setTab] = useState("revenue")
  const [revenue, setRevenue] = useState(0)
  const [cogs, setCogs] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [taxes, setTaxes] = useState(0)

  if (!open) return null

  const grossProfit = revenue - cogs
  const netProfit = grossProfit - expenses - taxes

  const save = async () => {
    const today = new Date().toISOString()

    const entries = [
      revenue && { amount: revenue, description: "Revenue", date: today },
      cogs && { amount: -Math.abs(cogs), description: "COGS", date: today },
      expenses && { amount: -Math.abs(expenses), description: "Operating Expenses", date: today },
      taxes && { amount: -Math.abs(taxes), description: "Taxes", date: today },
    ].filter(Boolean)

    for (const e of entries) {
      await api.post("/api/transactions", e)
    }

    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded p-6 space-y-4">
        <h2 className="text-xl font-bold">Add Financial Entry</h2>

        <div className="bg-gray-100 p-3 rounded text-sm space-y-1">
          <div>Revenue: ${revenue.toFixed(2)}</div>
          <div>COGS: ${cogs.toFixed(2)}</div>
          <div>Gross Profit: ${grossProfit.toFixed(2)}</div>
          <div>Net Profit: ${netProfit.toFixed(2)}</div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={save}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}