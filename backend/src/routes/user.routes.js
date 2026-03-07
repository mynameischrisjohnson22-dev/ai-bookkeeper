import { Router } from "express"
import prisma from "../utils/prisma.js"
import bcrypt from "bcryptjs"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

router.use(authMiddleware)

//////////////////////////////////////////////////////
// GET PROFILE
//////////////////////////////////////////////////////

router.get("/profile", async (req, res) => {

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
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)

  } catch (err) {

    console.error(err)
    res.status(500).json({ error: "Failed to load profile" })

  }

})

//////////////////////////////////////////////////////
// UPDATE PROFILE
//////////////////////////////////////////////////////

router.patch("/profile", async (req, res) => {

  try {

    const { businessName, currency } = req.body

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { businessName, currency },
      select: {
        email: true,
        businessName: true,
        currency: true
      }
    })

    res.json(user)

  } catch (err) {

    console.error(err)
    res.status(500).json({ error: "Failed to update profile" })

  }

})

//////////////////////////////////////////////////////
// UPDATE PASSWORD
//////////////////////////////////////////////////////

router.patch("/password", async (req, res) => {

  try {

    const { currentPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    })

    const valid = await bcrypt.compare(currentPassword, user.password)

    if (!valid) {
      return res.status(401).json({
        error: "Current password incorrect"
      })
    }

    const hashed = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed }
    })

    res.json({ success: true })

  } catch (err) {

    console.error(err)
    res.status(500).json({
      error: "Failed to update password"
    })

  }

})

//////////////////////////////////////////////////////
// DELETE ACCOUNT
//////////////////////////////////////////////////////

router.delete("/account", async (req, res) => {

  try {

    await prisma.user.update({
      where: { id: req.user.id },
      data: { deletedAt: new Date() }
    })

    res.json({ success: true })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      error: "Failed to delete account"
    })

  }

})

export default router