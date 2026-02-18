import express from "express"
import { runWeeklyDigest } from "../jobs/weeklyDigest.job.js"

const router = express.Router()

router.post("/send", async (_req, res) => {
  await runWeeklyDigest()
  res.json({ success: true })
})

export default router
