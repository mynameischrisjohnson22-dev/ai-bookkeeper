import express from "express"
import prisma from "../utils/prisma.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const { userId } = req.query
  if (!userId) return res.status(400).json([])

  const tx = await prisma.transaction.findMany({
    where: { userId },
  })

  const suggestions = []

  const income = tx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const expenses = tx.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)

  /* ---------- Gross Margin ---------- */
  const revenue = tx.filter(t => t.description === "Revenue").reduce((s, t) => s + t.amount, 0)
  const cogs = tx.filter(t => t.description === "COGS").reduce((s, t) => s + Math.abs(t.amount), 0)

  if (revenue > 0) {
    const grossMargin = ((revenue - cogs) / revenue) * 100
    if (grossMargin < 60) {
      suggestions.push({
        type: "margin",
        message: `Your gross margin is ${grossMargin.toFixed(1)}%, which is below a healthy range.`,
      })
    }
  }

  /* ---------- Software Overspend ---------- */
  const softwareSpend = tx
    .filter(t => t.category?.name === "Software")
    .reduce((s, t) => s + Math.abs(t.amount), 0)

  if (softwareSpend > income * 0.15) {
    suggestions.push({
      type: "overspend",
      message: "You’re overspending on software relative to revenue.",
    })
  }

  /* ---------- Runway Extension ---------- */
  if (expenses > 0 && income < expenses) {
    const burn = expenses - income
    suggestions.push({
      type: "runway",
      message: `Reducing expenses by 10% could extend your runway by ~${(burn * 0.1 / burn).toFixed(1)} months.`,
    })
  }

  res.json(suggestions)
})

export default router
