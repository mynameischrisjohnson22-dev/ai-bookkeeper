import express from "express"
import OpenAI from "openai"

const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

router.post("/", async (req, res) => {

  try {

    const { question } = req.body

    if (!question) {
      return res.status(400).json({ error: "Question required" })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
  {
    role: "system",
    content: "You are Albdy AI, a financial assistant that analyzes business transactions."
  },
  {
    role: "user",
    content: `
User question: ${question}

Transactions:
${JSON.stringify(transactions)}

Categories:
${JSON.stringify(categories)}
`
  }
]
    })

    res.json({
      answer: completion.choices[0].message.content
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "AI request failed"
    })

  }

})

export default router