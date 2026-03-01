"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function ChatBox() {
  const [message, setMessage] = useState("")
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!message.trim()) return

    try {
      setLoading(true)

      const res = await api.post("/api/ai", {
        message,
      })

      setReply(res.data.reply)
      setMessage("")
    } catch (err) {
      console.error("AI error:", err)
      setReply("AI unavailable")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded p-6 space-y-4 bg-slate-900 text-white">
      <h3 className="font-semibold text-lg">🤖 AI Assistant</h3>

      <input
        className="border border-slate-700 bg-slate-800 p-3 w-full rounded"
        placeholder="Ask about income, expenses, profit..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />

      <button
        onClick={send}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      {reply && (
        <div className="bg-slate-800 p-4 rounded text-sm whitespace-pre-wrap">
          {reply}
        </div>
      )}
    </div>
  )
}