import express from "express"
import prisma from "../utils/prisma.js"

const router = express.Router()

/*
========================================
PADDLE WEBHOOK
POST /api/paddle/webhook
========================================
*/

router.post("/webhook", async (req, res) => {

  try {

    const event = req.body
    const eventType = event?.event_type
    const data = event?.data

    if (!eventType || !data) {
      console.warn("⚠️ Invalid Paddle webhook payload")
      return res.status(400).send("Invalid webhook payload")
    }

    console.log("📩 Paddle event:", eventType)

    /*
    ========================================
    SUBSCRIPTION CREATED
    ========================================
    */

    if (eventType === "subscription.created") {

      const userId = data?.custom_data?.userId

      if (!userId) {
        console.warn("⚠️ Missing userId in Paddle custom_data")
        return res.sendStatus(200)
      }

      const existing = await prisma.subscription.findFirst({
        where: { paddleSubId: data.id }
      })

      if (!existing) {

        await prisma.subscription.create({
          data: {
            userId,
            paddleSubId: data.id,
            priceId: data.items?.[0]?.price?.id,
            status: "active",
            currentPeriodEnd: data.current_billing_period?.ends_at
              ? new Date(data.current_billing_period.ends_at)
              : null
          }
        })

        console.log("✅ Subscription created:", data.id)
      }
    }

    /*
    ========================================
    SUBSCRIPTION UPDATED
    ========================================
    */

    if (eventType === "subscription.updated") {

      await prisma.subscription.updateMany({
        where: { paddleSubId: data.id },
        data: {
          status: data.status,
          currentPeriodEnd: data.current_billing_period?.ends_at
            ? new Date(data.current_billing_period.ends_at)
            : null
        }
      })

      console.log("🔄 Subscription updated:", data.id)
    }

    /*
    ========================================
    SUBSCRIPTION CANCELED
    ========================================
    */

    if (eventType === "subscription.canceled") {

      await prisma.subscription.updateMany({
        where: { paddleSubId: data.id },
        data: {
          status: "canceled"
        }
      })

      console.log("❌ Subscription canceled:", data.id)
    }

    return res.sendStatus(200)

  } catch (error) {

    console.error("🔥 Paddle webhook error:", error)
    return res.sendStatus(500)

  }

})

export default router
