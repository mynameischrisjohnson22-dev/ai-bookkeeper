import express from "express"
import prisma from "../utils/prisma.js"
import fetch from "node-fetch"

const router = express.Router()

/*
  POST /ai/chat
*/
router.post("/chat", async (req, res) => {
  try {
    const { userId, message, period = "month" } = req.body

    if (!userId || !message) {
      return res.status(400).json({
        reply: "Missing userId or message."
      })
    }

    /* -------- LOAD TRANSACTIONS -------- */
    const transactions = await prisma.transaction.findMany({
      where: { userId: String(userId) },
      orderBy: { date: "asc" }
    })

    if (!transactions.length) {
      return res.json({
        reply: "You don’t have any transactions yet."
      })
    }

    /* -------- FILTER PERIOD -------- */
    const now = new Date()

    const filtered = transactions.filter(t => {
      const d = new Date(t.date)

      if (period === "month") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        )
      }

      const qNow = Math.floor(now.getMonth() / 3)
      const qTx = Math.floor(d.getMonth() / 3)

      return qNow === qTx && d.getFullYear() === now.getFullYear()
    })

    if (!filtered.length) {
      return res.json({
        reply: "No transactions for this period."
      })
    }

    /* -------- CALCULATE -------- */
    const income = filtered
      .filter(t => t.amount > 0)
      .reduce((s, t) => s + t.amount, 0)

    const expenses = filtered
      .filter(t => t.amount < 0)
      .reduce((s, t) => s + Math.abs(t.amount), 0)

    const balance = income - expenses

    /* -------- PROMPT -------- */
    const prompt = `
You are a financial assistant.

Income: $${income.toFixed(2)}
Expenses: $${expenses.toFixed(2)}
Balance: $${balance.toFixed(2)}

User question:
${message}

Answer clearly and concisely.
`

    const ollamaRes = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt,
          stream: false
        })
      }
    )

    const data = await ollamaRes.json()

    return res.json({
      reply: data?.response || "AI failed."
    })

  } catch (err) {
    console.error("AI ERROR:", err)
    return res.status(500).json({
      reply: "AI failed."
    })
  }
})

export default router
