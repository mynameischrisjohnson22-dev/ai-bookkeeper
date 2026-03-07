import { Router } from "express"
import prisma from "../utils/prisma.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

router.use(authMiddleware)

//////////////////////////////////////////////////////
// GET RECURRING RULES
//////////////////////////////////////////////////////

router.get("/", async (req, res) => {

  try {

    const rules = await prisma.recurringTransaction.findMany({
      where: {
        userId: req.user.id,
        active: true
      },
      orderBy: {
        nextRun: "asc"
      }
    })

    res.json(rules)

  } catch (err) {

    console.error("Recurring fetch error:", err)

    res.status(500).json({
      error: "Failed to load recurring rules"
    })

  }

})

//////////////////////////////////////////////////////
// CREATE RECURRING RULE
//////////////////////////////////////////////////////

router.post("/", async (req, res) => {

  try {

    const { name, amount, frequency, categoryId } = req.body

    if (!name || !amount || !frequency) {
      return res.status(400).json({
        error: "Name, amount, and frequency are required"
      })
    }

    const validFrequencies = ["daily","weekly","monthly","yearly"]

    if (!validFrequencies.includes(frequency)) {
      return res.status(400).json({
        error: "Invalid frequency"
      })
    }

    const recurring = await prisma.recurringTransaction.create({
      data: {
        userId: req.user.id,
        name: name.trim(),
        amount: Number(amount),
        frequency,
        categoryId: categoryId || null,
        nextRun: new Date(),
        active: true
      }
    })

    res.status(201).json(recurring)

  } catch (err) {

    console.error("Recurring create error:", err)

    res.status(500).json({
      error: "Failed to create recurring rule"
    })

  }

})

//////////////////////////////////////////////////////
// DELETE RECURRING RULE
//////////////////////////////////////////////////////

router.delete("/:id", async (req, res) => {

  try {

    const rule = await prisma.recurringTransaction.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    })

    if (!rule) {
      return res.status(404).json({
        error: "Recurring rule not found"
      })
    }

    await prisma.recurringTransaction.delete({
      where: {
        id: rule.id
      }
    })

    res.json({
      success: true
    })

  } catch (err) {

    console.error("Recurring delete error:", err)

    res.status(500).json({
      error: "Failed to delete recurring rule"
    })

  }

})

export default router