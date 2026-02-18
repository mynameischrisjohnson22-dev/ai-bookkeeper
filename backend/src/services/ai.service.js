import OpenAI from "openai"
import prisma from "../utils/prisma.js"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const chatWithAI = async (userId, message) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 50
  })

  const summary = transactions
    .map(
      (t) =>
        `${new Date(t.date).toDateString()} | ${t.description} | $${t.amount} | ${t.category || "Other"}`
    )
    .join("\n")

  const prompt = `
You are a personal finance assistant.

Here are the user's recent transactions:
${summary || "No transactions yet."}

User question:
${message}

Give a clear, helpful financial answer.
`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful finance assistant." },
      { role: "user", content: prompt }
    ]
  })

  return completion.choices[0].message.content
}
