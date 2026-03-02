"use client"

import { useState } from "react"
import api from "@/lib/api"

export default function AskAIPage() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return

    try {
      setLoading(true)

      const res = await api.post("/api/ai/ask", {
        message,
      })

      setResponse(res.data.reply)
      setMessage("")
    } catch (err) {
      console.error("AI error:", err)
      setResponse("Error connecting to AI.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Ask AI</h1>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something about your finances..."
        className="w-full h-40 border p-4 rounded"
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        className="bg-indigo-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Thinking..." : "Send"}
      </button>

      {response && (
        <div className="bg-gray-100 p-4 rounded">
          {response}
        </div>
      )}
    </div>
  )
}