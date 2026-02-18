import express from "express"
import prisma from "../utils/prisma.js"

const router = express.Router()

// POST /cfo/ask
router.post("/ask", async (req, res) => {
  try {
    const { userId, question } = req.body
    if (!userId || !question) {
      return res.status(400).json({ error: "Missing data" })
    }

    // Pull real transactions for context
    const tx = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 20,
    })

    // TEMP logic (LLM comes later)
    let answer = "Ask about profit, revenue, or expenses."

    if (question.toLowerCase().includes("profit")) {
      answer = "Profit depends on revenue minus COGS and expenses."
    }

    if (question.toLowerCase().includes("revenue")) {
      const revenue = tx
        .filter(t => t.amount > 0)
        .reduce((s, t) => s + t.amount, 0)

      answer = `Your recent revenue is $${revenue.toFixed(2)}`
    }

    res.json({ answer })
  } catch (err) {
    console.error("CFO ERROR:", err)
    res.status(500).json({ error: "CFO failed" })
  }
})

export default router
