import express from "express"
import { Paddle } from "@paddle/paddle-node-sdk"

const router = express.Router()

const paddle = new Paddle(process.env.PADDLE_API_KEY)

router.post("/checkout", async (req, res) => {

  try {

    const { priceId } = req.body

    const transaction = await paddle.transactions.create({
      items: [
        {
          price_id: priceId,
          quantity: 1
        }
      ]
    })

    res.json({
      url: transaction.checkout.url
    })

  } catch (err) {

    console.error("Paddle checkout error:", err)

    res.status(500).json({
      error: "Checkout failed"
    })

  }

})

export default router