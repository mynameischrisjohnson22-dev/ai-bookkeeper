import prisma from "../utils/prisma.js"

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name, isRevenue } = req.body
    const userId = req.user.id

    const category = await prisma.category.create({
      data: {
        name,
        isRevenue,
        userId,
      },
    })

    res.json(category)
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error)
    res.status(500).json({ error: "Failed to create category" })
  }
}

// GET CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const userId = req.user.id

    const categories = await prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    })

    res.json(categories)
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
}

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    await prisma.category.delete({
      where: {
        id,
        userId,
      },
    })

    res.json({ message: "Deleted" })
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error)
    res.status(500).json({ error: "Failed to delete category" })
  }
}