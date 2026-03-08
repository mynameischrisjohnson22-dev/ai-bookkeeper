import express from "express"
import { Paddle } from "@paddle/paddle-node-sdk"

const router = express.Router()

const paddle = new Paddle(process.env.PADDLE_API_KEY)

/*
PRICE IDS
*/

const PRICES = {
  essential: {
    monthly: "pri_01kk5sntb3tgm3w3jn14ntj3rt",
    yearly: "pri_01kk5syvsq7tt2kf9y2m6903rr",
    lifetime: "pri_01kk5t4tgdj91kaygevr0g0c8a"
  },
  plus: {
    monthly: "pri_01kk7m6aqt9k5nw8kp5ere0t4",
    yearly: "pri_01kk7m8zkbnhbnd0p5pa0smq",
    lifetime: "pri_01kk7mbczfnqty1m6fxn7d5k"
  }
}

/*
========================================
CREATE CHECKOUT
POST /api/billing/checkout
========================================
*/

router.post("/checkout", async (req, res) => {
  try {

    const { plan, billing } = req.body

    const priceId = PRICES?.[plan]?.[billing]

    if (!priceId) {
      return res.status(400).json({
        error: "Invalid plan selection"
      })
    }

    const transaction = await paddle.transactions.create({
      items: [
        {
          price_id: priceId,
          quantity: 1
        }
      ]
    })

    return res.json({
      url: transaction.checkout.url
    })

  } catch (err) {

    console.error("Paddle checkout error:", err)

    return res.status(500).json({
      error: "Checkout failed"
    })

  }
})

export default router