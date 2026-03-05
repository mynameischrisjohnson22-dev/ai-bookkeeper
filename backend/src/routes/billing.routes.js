import express from "express"
import axios from "axios"

const router = express.Router()

router.post("/checkout", async (req, res) => {

  try {

    const { priceId } = req.body

    const response = await axios.post(
      "https://api.paddle.com/transactions",
      {
        items: [
          {
            price_id: priceId,
            quantity: 1
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    res.json({
      url: response.data.data.checkout.url
    })

  } catch (err) {

    console.error(err.response?.data || err)

    res.status(500).json({
      error: "Checkout failed"
    })

  }

})

export default router