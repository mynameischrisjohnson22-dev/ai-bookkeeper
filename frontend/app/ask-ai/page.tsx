"use client"

import { useState } from "react"
import api from "@/lib/api"

type Msg = {
  role: "user" | "assistant"
  text: string
}

export default function AskAIPage() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return

    setMessages(m => [...m, { role: "user", text: q }])
    setInput("")
    setLoading(true)

    try {
      const res = await api.post("/api/ai/ask", {
        question: q,
      })

      setMessages(m => [
        ...m,
        { role: "assistant", text: res.data.answer },
      ])
    } catch {
      setMessages(m => [
        ...m,
        { role: "assistant", text: "Something went wrong." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Ask AI</h1>

      <div className="space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "text-right text-blue-600"
                : "text-left text-green-600"
            }
          >
            {m.text}
          </div>
        ))}

        {loading && <div className="text-gray-400">Thinking…</div>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Ask about your finances..."
        />

        <button
          onClick={send}
          className="bg-indigo-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}
