import express from "express"
import { Paddle } from "@paddle/paddle-node-sdk"

const router = express.Router()

const paddle = new Paddle(process.env.PADDLE_API_KEY)

/*
========================================
PRICE IDS
========================================
*/

const PRICES = {

  essential: {
    monthly: "pri_01kk5sntb3tgm3w3jn14ntj3rt",
    yearly: "pri_01kk5syvsq7tt2kf9y2m6903rr",
    lifetime: "pri_01kk5t4tgdj9lkaygevr0g0c8a"
  },

  plus: {
    monthly: "pri_01kk7m6aqt9k5nw8kp5ere0t4x",
    yearly: "pri_01kk7m8zkbnhbnd0p5pa0smqf4",
    lifetime: "pri_01kk7mbczfnqty1m6fxnd7d5kq"
  }

}

/*
========================================
POST /api/billing/checkout
CREATE PADDLE CHECKOUT
========================================
*/

router.post("/checkout", async (req, res) => {

  try {

    const { plan, billing } = req.body

    // Validate user session
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized"
      })
    }

    const userId = req.user.id
    const email = req.user.email

    // Validate plan
    const priceId = PRICES?.[plan]?.[billing]

    if (!priceId) {
      return res.status(400).json({
        error: "Invalid plan or billing option"
      })
    }

    const transaction = await paddle.transactions.create({

      items: [
        {
          price_id: priceId,
          quantity: 1
        }
      ],

      customer: {
        email
      },

      custom_data: {
        userId,
        plan,
        billing
      },

      checkout: {
  success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
  cancel_url: `${process.env.FRONTEND_URL}/dashboard`
}

    })

    return res.json({
      url: transaction.checkout.url
    })

  } catch (error) {

    console.error("Paddle checkout error:", error)

    return res.status(500).json({
      error: "Checkout failed"
    })

  }

})

export default router