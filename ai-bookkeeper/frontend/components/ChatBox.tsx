"use client"

import { useState } from "react"
import axios from "axios"

const API = "http://localhost:4000"

type Msg = {
  role: "user" | "ai"
  text: string
}

export default function ChatBox({
  period = "month",
}: {
  period?: "month" | "quarter"
}) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null

  const send = async () => {
    if (!input.trim()) return
    if (!userId) return alert("Not logged in")

    const text = input
    setInput("")

    setMessages(prev => [...prev, { role: "user", text }])

    try {
      setLoading(true)

      const res = await axios.post(`${API}/ai/chat`, {
        userId,
        message: text,
        period
      })

      setMessages(prev => [
        ...prev,
        { role: "ai", text: res.data.reply }
      ])

    } catch (err) {
      console.error("AI failed:", err)

      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Chat failed." }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col h-full">
      <h2 className="text-white font-semibold mb-4">
        AI Assistant
      </h2>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "text-right text-blue-400"
                : "text-left text-green-400"
            }
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <p className="text-slate-400 text-sm">
            Thinking…
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          className="flex-1 bg-slate-800 border border-slate-700 p-2 rounded text-white"
          onKeyDown={e => {
            if (e.key === "Enter") send()
          }}
        />

        <button
          onClick={send}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}
