import { Router } from "express"
import prisma from "../utils/prisma.js"
import authMiddleware from "../middleware/auth.middleware.js"

const router = Router()

/* ================================
   GET CATEGORIES
================================ */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id

    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId },
          { builtIn: true }
        ]
      },
      orderBy: { createdAt: "asc" }
    })

    res.json(categories)
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

/* ================================
   CREATE CATEGORY
================================ */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const { name, parent = null, isRevenue } = req.body

    if (!name) {
      return res.status(400).json({ error: "Category name required" })
    }

    const category = await prisma.category.create({
      data: {
        name,
        parent,
        isRevenue: Boolean(isRevenue),
        userId
      }
    })

    res.status(201).json(category)
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error)
    res.status(500).json({ error: "Failed to create category" })
  }
})

/* ================================
   DELETE CATEGORY
================================ */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    await prisma.category.deleteMany({
      where: {
        id,
        userId
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error)
    res.status(500).json({ error: "Failed to delete category" })
  }
})

export default router
