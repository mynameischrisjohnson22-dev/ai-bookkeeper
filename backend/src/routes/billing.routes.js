import express from "express"
import { Paddle } from "@paddle/paddle-node-sdk"

const router = express.Router()

const paddle = new Paddle(process.env.PADDLE_API_KEY)

/*
<<<<<<< HEAD
========================================
PLAN PRICE IDS
========================================
=======
PLAN PRICE IDS
>>>>>>> 05d666d (fix prisma auto push)
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
    lifetime: "pri_01kk7mbczfnqty1m6fxnd7d5k"
  }
}

/*
<<<<<<< HEAD
========================================
CREATE CHECKOUT
POST /api/billing/checkout
========================================
=======
CREATE CHECKOUT
>>>>>>> 05d666d (fix prisma auto push)
*/

router.post("/checkout", async (req, res) => {

  try {

<<<<<<< HEAD
    const { plan, billing, userId } = req.body

    if (!plan || !billing || !userId) {
      return res.status(400).json({
        error: "Missing plan, billing, or userId"
      })
    }
=======
    const { plan, billing } = req.body
>>>>>>> 05d666d (fix prisma auto push)

    const priceId = PRICES?.[plan]?.[billing]

    if (!priceId) {
<<<<<<< HEAD
      return res.status(400).json({
        error: "Invalid plan selection"
      })
=======
      return res.status(400).json({ error: "Invalid plan selection" })
>>>>>>> 05d666d (fix prisma auto push)
    }

    const transaction = await paddle.transactions.create({

      items: [
        {
          price_id: priceId,
          quantity: 1
        }
<<<<<<< HEAD
      ],

      custom_data: {
        userId
      }
=======
      ]
>>>>>>> 05d666d (fix prisma auto push)

    })

    return res.json({
      url: transaction.checkout.url
    })

  } catch (error) {

    console.error("🔥 Paddle checkout error:", error)

    return res.status(500).json({
      error: "Checkout failed"
    })
  }

})

export default router
