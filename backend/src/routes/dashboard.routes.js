import { Router } from "express"
import prisma from "../utils/prisma.js"
import authMiddleware from "../middleware/auth.middleware.js"

const router = Router()

router.use(authMiddleware)

/*
GET /api/dashboard/summary
*/

router.get("/summary", async (req, res) => {

  try {

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        deletedAt: null
      }
    })

    let revenue = 0
    let expenses = 0

    transactions.forEach(t => {
      if (t.amount > 0) revenue += t.amount
      else expenses += Math.abs(t.amount)
    })

    const profit = revenue - expenses

    res.json({
      revenue,
      expenses,
      profit
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: "Failed to load dashboard"
    })
  }

})

export default router