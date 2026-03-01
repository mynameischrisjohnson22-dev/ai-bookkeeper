import { Router } from "express"
import prisma from "../utils/prisma.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

// 🔐 Protect ALL category routes
router.use(authMiddleware)

///////////////////////////////////////////////////////
// GET categories
///////////////////////////////////////////////////////

router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          { builtIn: true }
        ]
      },
      orderBy: { createdAt: "asc" }
    })

    res.json(categories)
  } catch (err) {
    console.error("GET categories error:", err)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

///////////////////////////////////////////////////////
// CREATE category
///////////////////////////////////////////////////////

router.post("/", async (req, res) => {
  try {
    const { name, isRevenue } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name required" })
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        isRevenue: Boolean(isRevenue),
        userId: req.user.id
      }
    })

    res.status(201).json(category)

  } catch (err) {
    console.error("CREATE category error:", err)
    res.status(500).json({ error: "Failed to create category" })
  }
})

///////////////////////////////////////////////////////
// DELETE category
///////////////////////////////////////////////////////

router.delete("/:id", async (req, res) => {
  try {
    await prisma.category.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    })

    res.json({ success: true })

  } catch (err) {
    console.error("DELETE category error:", err)
    res.status(500).json({ error: "Failed to delete category" })
  }
})

export default router