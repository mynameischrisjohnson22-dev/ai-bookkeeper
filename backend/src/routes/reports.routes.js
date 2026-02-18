import express from "express"

const router = express.Router()

router.get("/reports/monthly/:userId", async (req, res) => {
  res.json({ message: "Monthly report coming soon" })
})

export default router
