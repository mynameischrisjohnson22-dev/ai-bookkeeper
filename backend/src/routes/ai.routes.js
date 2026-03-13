import express from "express"
import OpenAI from "openai"

const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

router.post("/", async (req, res) => {

  try {

    const { question, transactions = [], categories = [] } = req.body

    if (!question) {
      return res.status(400).json({
        error: "Question required"
      })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are Albdy AI, an intelligent financial assistant for businesses.

You analyze financial data and answer questions about:
- income
- expenses
- profit
- financial trends
- spending categories

Always use the provided transaction data to calculate answers.
Be concise and clear.
`
        },
        {
          role: "user",
          content: `
User question:
${question}

Transactions:
${JSON.stringify(transactions, null, 2)}

Categories:
${JSON.stringify(categories, null, 2)}
`
        }
      ]
    })

    const answer = completion.choices?.[0]?.message?.content || "No response from AI."

    res.json({
      answer
    })

  } catch (error) {

    console.error("AI ERROR:", error)

    res.status(500).json({
      error: "AI request failed"
    })

  }

})

export default router