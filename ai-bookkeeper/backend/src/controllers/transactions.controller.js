import fs from "fs"
import csv from "csv-parser"
import prisma from "../utils/prisma.js"

/* ===============================
   UPLOAD CSV TRANSACTIONS
=============================== */
export const uploadTransactions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const userId = req.user.id  // ✅ SECURE

    const rows = []

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", async () => {
        try {
          const saved = await Promise.all(
            rows.map((tx) =>
              prisma.transaction.create({
                data: {
                  userId,
                  date: new Date(tx.Date || tx.date),
                  description: tx.Description || tx.description,
                  amount: parseFloat(tx.Amount || tx.amount),
                }
              })
            )
          )

          fs.unlinkSync(req.file.path)

          res.json({
            success: true,
            count: saved.length
          })

        } catch (dbErr) {
          console.error("DB SAVE ERROR:", dbErr)
          res.status(500).json({ error: "Failed to save transactions" })
        }
      })

  } catch (err) {
    console.error("UPLOAD ERROR:", err)
    res.status(500).json({ error: "CSV upload failed" })
  }
}

/* ===============================
   GET USER TRANSACTIONS
=============================== */
export const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id   // ✅ SECURE
      },
      orderBy: {
        date: "desc"
      }
    })

    res.json(transactions)

  } catch (err) {
    console.error("FETCH ERROR:", err)
    res.status(500).json({ error: "Failed to fetch transactions" })
  }
}
