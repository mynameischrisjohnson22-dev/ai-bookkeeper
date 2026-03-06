import express from "express"
import { Paddle } from "@paddle/paddle-node-sdk"

const router = express.Router()

const paddle = new Paddle(process.env.PADDLE_API_KEY)

router.post("/checkout", async (req, res) => {
  try {

    const { priceId } = req.body

    const checkout = await paddle.checkout.sessions.create({
      items: [
        {
          priceId: priceId,
          quantity: 1
        }
      ],
      successUrl: `${process.env.FRONTEND_URL}/dashboard`,
      cancelUrl: `${process.env.FRONTEND_URL}/billing`
    })

    res.json({
      url: checkout.url
    })

  } catch (err) {

    console.error("Paddle checkout error:", err)

    res.status(500).json({
      error: "Checkout failed"
    })

  }
})

export default router