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
    const event_type = event?.event_type
    const data = event?.data

    if (!event_type || !data) {
      return res.status(400).send("Invalid webhook payload")
    }

    console.log("Paddle event:", event_type)

    /*
    SUBSCRIPTION CREATED
    */

    if (event_type === "subscription.created") {

      const userId = data.custom_data?.userId

      if (!userId) {
        console.warn("Missing userId in custom_data")
        return res.sendStatus(200)
      }

      const existing = await prisma.subscription.findUnique({
        where: { paddleSubId: data.id }
      })

      if (!existing) {

        await prisma.subscription.create({
          data: {
            userId,
            paddleSubId: data.id,
            priceId: data.items?.[0]?.price?.id,
            status: data.status,
            currentPeriodEnd: data.current_billing_period?.ends_at
              ? new Date(data.current_billing_period.ends_at)
              : null
          }
        })

      }

    }

    /*
    SUBSCRIPTION UPDATED
    */

    if (event_type === "subscription.updated") {

      await prisma.subscription.updateMany({
        where: { paddleSubId: data.id },
        data: {
          status: data.status,
          currentPeriodEnd: data.current_billing_period?.ends_at
            ? new Date(data.current_billing_period.ends_at)
            : null
        }
      })

    }

    /*
    SUBSCRIPTION CANCELED
    */

    if (event_type === "subscription.canceled") {

      await prisma.subscription.updateMany({
        where: { paddleSubId: data.id },
        data: {
          status: "canceled"
        }
      })

    }

    return res.sendStatus(200)

  } catch (error) {

    console.error("Paddle webhook error:", error)

    return res.sendStatus(500)

  }

})

export default router