import express from "express"
import prisma from "../utils/prisma.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

/////////////////////////////////////////////////////
// GET PROFILE
/////////////////////////////////////////////////////

router.get("/profile", authMiddleware, async (req, res) => {

  try {

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        email: true,
        businessName: true,
        currency: true
      }
    })

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      })
    }

    res.json(user)

  } catch (err) {

    console.error("Profile fetch error:", err)

    res.status(500).json({
      error: "Failed to load profile"
    })

  }

})

/////////////////////////////////////////////////////
// UPDATE PROFILE
/////////////////////////////////////////////////////

router.patch("/profile", authMiddleware, async (req, res) => {

  try {

    const { businessName, currency } = req.body

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        businessName,
        currency
      },
      select: {
        email: true,
        businessName: true,
        currency: true
      }
    })

    res.json(user)

  } catch (err) {

    console.error("Profile update error:", err)

    res.status(500).json({
      error: "Failed to update profile"
    })

  }

})

/////////////////////////////////////////////////////
// DELETE ACCOUNT (SOFT DELETE)
/////////////////////////////////////////////////////

router.delete("/account", authMiddleware, async (req, res) => {

  try {

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        deletedAt: new Date()
      }
    })

    res.json({
      success: true
    })

  } catch (err) {

    console.error("Account delete error:", err)

    res.status(500).json({
      error: "Failed to delete account"
    })

  }

})

export default router