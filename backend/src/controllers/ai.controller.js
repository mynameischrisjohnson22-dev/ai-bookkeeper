import OpenAI from "openai"
import prisma from "../utils/prisma.js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const chat = async (req, res) => {
  try {
    const { userId, message } = req.body

    if (!userId || !message) {
      return res.status(400).json({ error: "Missing userId or message" })
    }

    const tx = await prisma.transaction.findMany({
      where: { userId }
    })

    const summary = tx
      .map(t => `${t.date} | ${t.description} | ${t.amount}`)
      .join("\n")

    const prompt = `
You are a financial assistant.

User transactions:
${summary || "No transactions yet"}

User question:
${message}

Give a short helpful answer.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })

    res.json({
      reply: completion.choices[0].message.content
    })
  } catch (err) {
    console.error("AI ERROR:", err.message)
    res.status(500).json({ error: "AI failed" })
  }
}
