import express from "express"
import axios from "axios"

const router = express.Router()

router.post("/checkout", async (req, res) => {

  try {

    const { priceId } = req.body

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" })
    }

    const response = await axios.post(
      "https://api.paddle.com/transactions",
      {
        items: [
          {
            price_id: priceId,
            quantity: 1
          }
        ],

        checkout: {
          success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
          cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancel`
        }

      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    const checkoutUrl = response.data?.data?.checkout?.url

    if (!checkoutUrl) {
      return res.status(500).json({ error: "Checkout URL missing" })
    }

    res.json({
      url: checkoutUrl
    })

  } catch (error) {

    console.error("Paddle checkout error:", error.response?.data || error)

    res.status(500).json({
      error: "Checkout failed"
    })

  }

})

export default router