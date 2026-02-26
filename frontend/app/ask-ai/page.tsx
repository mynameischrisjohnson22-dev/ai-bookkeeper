"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"

const API = "http://localhost:4000"

type Msg = {
  role: "user" | "assistant"
  text: string
}

export default function AskAIPage() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async (text?: string) => {
    const q = (text ?? input).trim()
    if (!q || !userId || loading) return

    setMessages(m => [...m, { role: "user", text: q }])
    setInput("")
    setLoading(true)

    try {
      const res = await axios.post(`${API}/ai/ask`, {
        userId,
        question: q
      })

      setMessages(m => [
        ...m,
        { role: "assistant", text: res.data.answer }
      ])
    } catch (e) {
      setMessages(m => [
        ...m,
        {
          role: "assistant",
          text: "Sorry — something went wrong."
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const empty = messages.length === 0

  return (
    <div className="h-full flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-4">Ask AI</h1>

      <div className="flex-1 bg-white rounded-xl border flex flex-col overflow-hidden">

        {/* ================= EMPTY STATE ================= */}
        {empty && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="text-4xl mb-4">🤖</div>

            <h2 className="text-xl font-semibold mb-2">
              Your Financial AI Assistant
            </h2>

            <p className="text-sm text-gray-500 mb-6 max-w-md">
              Ask me about your spending, get budget advice, or request
              financial summaries. I have access to your transaction data.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => send("Where am I spending the most?")}
                className="border rounded-full px-4 py-2 text-sm"
              >
                Where am I spending the most?
              </button>

              <button
                onClick={() => send("How can I save more?")}
                className="border rounded-full px-4 py-2 text-sm"
              >
                How can I save more?
              </button>

              <button
                onClick={() => send("Summarize my spending this month")}
                className="border rounded-full px-4 py-2 text-sm"
              >
                Summarize my spending this month
              </button>
            </div>
          </div>
        )}

        {/* ================= CHAT ================= */}
        {!empty && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                  className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-400">
                Thinking…
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}

        {/* ================= INPUT ================= */}
        <div className="border-t p-3 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about your finances..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />

          <button
            onClick={() => send()}
            className="bg-indigo-500 text-white px-4 rounded-lg"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
