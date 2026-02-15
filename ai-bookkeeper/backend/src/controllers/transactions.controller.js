import fs from "fs"
import csv from "csv-parser"
import prisma from "../utils/prisma.js"

export const uploadTransactions = async (req, res) => {
  try {
    console.log("📥 CSV UPLOAD REQUEST RECEIVED")

    if (!req.file) {
      console.error("❌ No file uploaded")
      return res.status(400).json({ error: "No file uploaded" })
    }

    const userId = req.body.userId
    if (!userId) {
      console.error("❌ No userId provided")
      return res.status(400).json({ error: "Missing userId" })
    }

    console.log("👤 User ID:", userId)
    console.log("📄 File path:", req.file.path)

    const results = []

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        console.log("📑 Row:", data)
        results.push(data)
      })
      .on("end", async () => {
        try {
          const saved = await Promise.all(
            results.map((tx) =>
              prisma.transaction.create({
                data: {
                  userId,
                  date: new Date(tx.Date || tx.date),
                  description: tx.Description || tx.description,
                  amount: parseFloat(tx.Amount || tx.amount),
                },
              })
            )
          )

          fs.unlinkSync(req.file.path) // cleanup temp file

          console.log("✅ Saved:", saved.length, "transactions")
          res.json({ count: saved.length })
        } catch (dbErr) {
          console.error("❌ DB SAVE ERROR:", dbErr)
          res.status(500).json({ error: "Failed to save transactions" })
        }
      })
  } catch (err) {
    console.error("❌ UPLOAD ERROR:", err)
    res.status(500).json({ error: "CSV upload failed" })
  }
}

export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" })
    }

    const tx = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    })

    res.json(tx)
  } catch (err) {
    console.error("❌ FETCH ERROR:", err)
    res.status(500).json({ error: "Failed to fetch transactions" })
  }
}
