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
      return res.status(400).json({
        error: "Question required"
      })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are Albdy AI, a financial assistant for businesses."
        },
        {
          role: "user",
          content: question
        }
      ]
    })

    res.json({
      answer: completion.choices[0].message.content
    })

  } catch (error) {

    console.error("AI ERROR:", error)

    res.status(500).json({
      error: "AI request failed"
    })

  }

})

export default router