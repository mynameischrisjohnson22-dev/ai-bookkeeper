"use client"

import { useEffect, useRef, useState } from "react"
import api from "@/lib/api"

type Msg = {
  role: "user" | "assistant"
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

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    setMessages(prev => [...prev, { role: "user", text }])
    setInput("")
    setLoading(true)

    try {
      const res = await api.post("/api/ai/ask", {
        message: text,
        period,
      })

      const reply =
        res.data?.answer ||
        res.data?.reply ||
        "No response received."

      setMessages(prev => [
        ...prev,
        { role: "assistant", text: reply },
      ])
    } catch (err) {
      console.error("AI failed:", err)

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry — something went wrong.",
        },
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

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-green-400"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-slate-400 text-sm">
            Thinking…
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about your finances..."
          className="flex-1 bg-slate-800 border border-slate-700 p-2 rounded text-white"
        />

        <button
          onClick={send}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  )
}