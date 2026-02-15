import express from "express"
import { paddle } from "../utils/paddle.js"

const router = express.Router()

/*
POST /billing/checkout
body:
{
  priceId: "pri_...",
  userId: "..."
}
*/
router.post("/checkout", async (req, res) => {
  try {
    const { priceId, userId } = req.body

    if (!priceId || !userId) {
      return res.status(400).json({ error: "Missing priceId or userId" })
    }

    const transaction = await paddle.transactions.create({
      items: [
        {
          priceId,
          quantity: 1
        }
      ],
      customData: {
        userId
      }
    })

    res.json({
      url: transaction.checkout.url
    })
  } catch (err) {
    console.error("PADDLE CHECKOUT ERROR", err)
    res.status(500).json({ error: "Failed to create checkout" })
  }
})

export default router
