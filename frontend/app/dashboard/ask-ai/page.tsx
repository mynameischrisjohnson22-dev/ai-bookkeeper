"use client"

import { useState } from "react"
import axios from "axios"

const API = "http://localhost:4000"

export default function AskAI() {
  const [dark, setDark] = useState(true)
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!message) return
    setLoading(true)

    try {
      const res = await axios.post(`${API}/ask-ai`, { message })
      setResponse(res.data.reply)
    } catch (err) {
      setResponse("Error connecting to AI.")
    }

    setLoading(false)
  }

  return (
    <div className={`${dark ? "bg-[#020b1f] text-white" : "bg-white text-black"} min-h-screen p-10`}>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ask AI</h1>
        <button
          onClick={() => setDark(!dark)}
          className="border px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Toggle Dark Mode
        </button>
      </div>

      <div className="bg-[#0f1a33] p-8 rounded-2xl max-w-3xl">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something about your finances..."
          className="w-full h-40 p-4 rounded-lg bg-[#1a2747] text-white placeholder-gray-300 border border-gray-600 focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? "Thinking..." : "Send"}
        </button>

        {response && (
          <div className="mt-6 bg-[#1a2747] p-4 rounded-lg text-gray-200">
            {response}
          </div>
        )}
      </div>
    </div>
  )
}
