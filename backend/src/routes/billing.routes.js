import express from "express"
import { paddle } from "../utils/paddle.js"

const router = express.Router()

/*
POST /api/billing/checkout

body:
{
  priceId: "pri_xxxxx",
  userId: "user_uuid"
}
*/

router.post("/checkout", async (req, res) => {
  try {
    const { priceId, userId } = req.body

    if (!priceId || !userId) {
      return res.status(400).json({
        error: "priceId and userId are required"
      })
    }

    const transaction = await paddle.transactions.create({
      items: [
        {
          price_id: priceId,
          quantity: 1
        }
      ],
      custom_data: {
        userId
      }
    })

    if (!transaction?.checkout?.url) {
      throw new Error("Checkout URL not returned from Paddle")
    }

    return res.json({
      checkoutUrl: transaction.checkout.url
    })

  } catch (error) {
    console.error("❌ Paddle checkout error:", error)

    return res.status(500).json({
      error: "Failed to create checkout"
    })
  }
})

export default router