"use client"

import { useState } from "react"
import axios from "axios"

const API = "http://localhost:4000"

export default function ChatBox() {
  const [message, setMessage] = useState("")
  const [reply, setReply] = useState("")

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null

  const send = async () => {
    if (!message || !userId) return

    try {
      const res = await axios.post(`${API}/cfo/ask`, {
        userId,
        question: message,
      })

      setReply(res.data.answer)
      setMessage("")
    } catch {
      setReply("CFO unavailable")
    }
  }

  return (
    <div className="border rounded p-4 space-y-2">
      <h3 className="font-semibold">🤖 AI CFO</h3>

      <input
        className="border p-2 w-full"
        placeholder="Ask about profit, revenue, hiring..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <button
        onClick={send}
        className="bg-black text-white px-3 py-1 rounded"
      >
        Ask
      </button>

      {reply && (
        <div className="bg-gray-100 p-2 rounded text-sm">
          {reply}
        </div>
      )}
    </div>
  )
}
