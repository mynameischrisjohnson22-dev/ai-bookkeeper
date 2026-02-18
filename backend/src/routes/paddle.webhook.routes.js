import express from "express"
import crypto from "crypto"
import prisma from "../utils/prisma.js"

const router = express.Router()

router.post("/paddle/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["paddle-signature"]
  const secret = process.env.PADDLE_WEBHOOK_SECRET

  const body = req.body

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex")

  if (hmac !== sig) {
    return res.status(401).send("Invalid signature")
  }

  const event = JSON.parse(body.toString())

  try {
    if (event.event_type === "transaction.completed") {
      const data = event.data

      const userId = data.custom_data?.userId

      const price = data.items?.[0]?.price

      const plan = price?.custom_data?.plan
      const billingType = price?.custom_data?.billing_type

      if (!userId || !plan) return res.sendStatus(200)

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan,
          billingType,
          isPro: plan === "pro"
        }
      })
    }

    res.sendStatus(200)
  } catch (err) {
    console.error("PADDLE WEBHOOK ERROR", err)
    res.sendStatus(500)
  }
})

export default router
