import fetch from "node-fetch"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama3-70b-8192"

export const categorizeTransactions = async (transactions) => {
  const categorized = []

  for (const tx of transactions) {
    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "Categorize this bank transaction into ONE word: Food, Rent, Salary, Utilities, Entertainment, Travel, Shopping, Healthcare, Transfer, Other."
            },
            {
              role: "user",
              content: `Transaction: ${tx.description}, Amount: ${tx.amount}`
            }
          ]
        })
      })

      const data = await res.json()

      const category =
        data?.choices?.[0]?.message?.content?.trim() || "Other"

      categorized.push({ ...tx, category })
    } catch (err) {
      console.error("AI categorize failed:", err)
      categorized.push({ ...tx, category: "Other" })
    }
  }

  return categorized
}
