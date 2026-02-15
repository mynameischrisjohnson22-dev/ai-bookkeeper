import express from "express"
import prisma from "../utils/prisma.js"

const router = express.Router()

// GET /metrics/burn-rate?userId=xxx
router.get("/burn-rate", async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) return res.status(400).json({})

    const last30 = new Date()
    last30.setDate(last30.getDate() - 30)

    const expenses = await prisma.transaction.aggregate({
      where: {
        userId,
        amount: { lt: 0 },
        date: { gte: last30 },
      },
      _sum: { amount: true },
    })

    const total = await prisma.transaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    })

    const burn = Math.abs(expenses._sum.amount || 0)
    const runway = burn ? (total._sum.amount || 0) / burn : null

    res.json({
      burnRate: burn,
      runwayMonths: runway,
    })
  } catch (err) {
    console.error("METRICS ERROR:", err)
    res.status(500).json({})
  }
})

export default router
