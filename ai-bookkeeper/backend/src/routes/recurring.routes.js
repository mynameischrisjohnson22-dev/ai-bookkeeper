import express from "express"
import prisma from "../utils/prisma.js"

const router = express.Router()

/* ======================================================
   GET RECURRING ENTRIES
   GET /recurring?userId=xxx
====================================================== */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) return res.json([])

    const list = await prisma.recurringEntry.findMany({
      where: { userId: String(userId) },
      include: { category: true },
      orderBy: { nextRun: "asc" }
    })

    res.json(list)
  } catch (err) {
    console.error("GET RECURRING ERROR:", err)
    res.status(500).json([])
  }
})

/* ======================================================
   CREATE RECURRING ENTRY
   POST /recurring
====================================================== */
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      description,
      amount,
      cadence,
      nextRun,
      categoryId
    } = req.body

    if (!userId || !description || amount === undefined || !cadence || !nextRun) {
      return res.status(400).json({ error: "Missing fields" })
    }

    const entry = await prisma.recurringEntry.create({
      data: {
        userId,
        description,
        amount: Number(amount),
        cadence,
        nextRun: new Date(nextRun),
        categoryId: categoryId || null
      }
    })

    res.json(entry)
  } catch (err) {
    console.error("CREATE RECURRING ERROR:", err)
    res.status(500).json({ error: "Failed to create recurring entry" })
  }
})

/* ======================================================
   DELETE RECURRING ENTRY
   DELETE /recurring/:id
====================================================== */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.recurringEntry.delete({
      where: { id: req.params.id }
    })

    res.sendStatus(204)
  } catch (err) {
    console.error("DELETE RECURRING ERROR:", err)
    res.status(500).json({ error: "Failed to delete recurring entry" })
  }
})

export default router

