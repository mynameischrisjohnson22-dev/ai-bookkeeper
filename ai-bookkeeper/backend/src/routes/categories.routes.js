import { Router } from "express"
import prisma from "../prisma.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

// GET categories
router.get("/", authMiddleware, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId: req.user.userId },
          { builtIn: true }
        ]
      },
      orderBy: { createdAt: "asc" }
    })

    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

// CREATE category
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, parent, isRevenue } = req.body

    const category = await prisma.category.create({
      data: {
        name,
        parent,
        isRevenue,
        userId: req.user.userId
      }
    })

    res.json(category)
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" })
  }
})

// DELETE category (must belong to user)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    await prisma.category.deleteMany({
      where: {
        id,
        userId: req.user.userId
      }
    })

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" })
  }
})

export default router
