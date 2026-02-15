import { Router } from "express"
import prisma from "../utils/prisma.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

// Protect all routes
router.use(authMiddleware)

/* ======================================================
   GET ALL TRANSACTIONS
====================================================== */
router.get("/", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id
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
router.post("/", async (req, res) => {
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
        userId: req.user.id
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
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params

    await prisma.transaction.deleteMany({
      where: {
        id,
        userId: req.user.id
      }
    })

    res.json({ success: true })

  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error)
    res.status(500).json({ error: "Failed to delete transaction" })
  }
})

/* ======================================================
   RESET BUSINESS
====================================================== */
router.delete("/business/reset", async (req, res) => {
  try {
    await prisma.transaction.deleteMany({
      where: {
        userId: req.user.id
      }
    })

    res.json({ success: true })

  } catch (error) {
    console.error("RESET BUSINESS ERROR:", error)
    res.status(500).json({ error: "Failed to reset business data" })
  }
})

export default router
