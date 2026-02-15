import { Router } from "express"
import prisma from "../prisma.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

/* ======================================================
   GET ALL TRANSACTIONS
====================================================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.userId
      },
      orderBy: {
        date: "desc"
      }
    })

    res.json(transactions)

  } catch (error) {
    console.error("GET TRANSACTIONS ERROR:", error)
    res.status(500).json({ error: "Failed to fetch transactions" })
  }
})


/* ======================================================
   CREATE TRANSACTION
====================================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { date, description, amount, categoryId } = req.body

    if (!date || !description || amount === undefined) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        amount: Number(amount),
        categoryId: categoryId || null,
        userId: req.user.userId
      }
    })

    res.json(transaction)

  } catch (error) {
    console.error("CREATE TRANSACTION ERROR:", error)
    res.status(500).json({ error: "Failed to create transaction" })
  }
})


/* ======================================================
   DELETE SINGLE TRANSACTION (USER SAFE)
====================================================== */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    await prisma.transaction.deleteMany({
      where: {
        id,
        userId: req.user.userId
      }
    })

    res.json({ success: true })

  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error)
    res.status(500).json({ error: "Failed to delete transaction" })
  }
})


/* ======================================================
   RESET BUSINESS (DELETE USER TRANSACTIONS)
====================================================== */
router.delete("/business/reset", authMiddleware, async (req, res) => {
  try {
    await prisma.transaction.deleteMany({
      where: {
        userId: req.user.userId
      }
    })

    res.json({ success: true })

  } catch (error) {
    console.error("RESET BUSINESS ERROR:", error)
    res.status(500).json({ error: "Failed to reset business data" })
  }
})

export default router
