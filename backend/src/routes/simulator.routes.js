import express from "express"

const router = express.Router()

router.post("/simulate", (req, res) => {
  const { currentProfit, hireCost, revenueDrop } = req.body

  let projected = currentProfit
  if (hireCost) projected -= hireCost
  if (revenueDrop) projected *= (1 - revenueDrop / 100)

  res.json({ projectedProfit: projected })
})

export default router
