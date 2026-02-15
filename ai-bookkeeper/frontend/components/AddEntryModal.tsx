"use client"

import { useState } from "react"
import axios from "axios"

const API = "http://localhost:4000"

export default function AddEntryModal({
  open,
  onClose,
  userId,
  token,
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
      revenue && {
        amount: revenue,
        description: "Revenue",
        date: today,
      },
      cogs && {
        amount: -Math.abs(cogs),
        description: "COGS",
        date: today,
      },
      expenses && {
        amount: -Math.abs(expenses),
        description: "Operating Expenses",
        date: today,
      },
      taxes && {
        amount: -Math.abs(taxes),
        description: "Taxes",
        date: today,
      },
    ].filter(Boolean)

    for (const e of entries) {
      await axios.post(
        `${API}/transactions`,
        { ...e, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    }

    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded p-6 space-y-4">
        <h2 className="text-xl font-bold">Add Financial Entry</h2>

        {/* Tabs */}
        <div className="flex gap-2">
          {["revenue", "cogs", "expenses", "taxes"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded ${
                tab === t ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Inputs */}
        {tab === "revenue" && (
          <input
            type="number"
            placeholder="Revenue"
            className="border p-2 w-full"
            onChange={e => setRevenue(+e.target.value)}
          />
        )}

        {tab === "cogs" && (
          <input
            type="number"
            placeholder="COGS"
            className="border p-2 w-full"
            onChange={e => setCogs(+e.target.value)}
          />
        )}

        {tab === "expenses" && (
          <input
            type="number"
            placeholder="Operating Expenses"
            className="border p-2 w-full"
            onChange={e => setExpenses(+e.target.value)}
          />
        )}

        {tab === "taxes" && (
          <input
            type="number"
            placeholder="Taxes"
            className="border p-2 w-full"
            onChange={e => setTaxes(+e.target.value)}
          />
        )}

        {/* Live Summary */}
        <div className="bg-gray-100 p-3 rounded text-sm space-y-1">
          <div>Revenue: ${revenue.toFixed(2)}</div>
          <div>COGS: ${cogs.toFixed(2)}</div>
          <div>Gross Profit: ${grossProfit.toFixed(2)}</div>
          <div>Net Profit: ${netProfit.toFixed(2)}</div>
        </div>

        {/* Actions */}
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
