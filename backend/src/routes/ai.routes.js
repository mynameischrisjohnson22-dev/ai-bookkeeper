import { Router } from "express"
import OpenAI from "openai"
import { authMiddleware } from "../middleware/auth.middleware.js"
import prisma from "../utils/prisma.js"

const router = Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: "Message required" })
    }

    // Get user's transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { date: "desc" },
    })

    const formatted = transactions
      .map(
        (t) =>
          `${t.date.toISOString()} | ${t.description} | ${t.amount}`
      )
      .join("\n")

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a financial assistant. Answer using the user's transaction data.",
        },
        {
          role: "user",
          content: `User Transactions:\n${formatted}\n\nQuestion:\n${message}`,
        },
      ],
    })

    return res.json({
      reply: completion.choices[0].message.content,
    })
  } catch (err) {
    console.error("AI ERROR:", err)
    return res.status(500).json({ error: "AI failed" })
  }
})

export default router