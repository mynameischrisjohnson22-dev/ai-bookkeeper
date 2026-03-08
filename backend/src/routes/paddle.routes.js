import express from "express"
import prisma from "../utils/prisma.js"

const router = express.Router()

router.post("/webhook", async (req, res) => {

  try {

    const { event_type, data } = req.body

    if (!event_type || !data) {
      return res.status(400).send("Invalid webhook payload")
    }

<<<<<<< HEAD
    console.log("📩 Paddle event:", eventType)

    /*
    ========================================
    SUBSCRIPTION CREATED
    ========================================
=======
    console.log("📩 Paddle event:", event_type)

    /*
    SUBSCRIPTION CREATED
>>>>>>> 05d666d (fix prisma auto push)
    */

    if (event_type === "subscription.created") {

      const userId = data?.custom_data?.userId

<<<<<<< HEAD
      if (!userId) {
        console.warn("⚠️ Missing userId in Paddle custom_data")
        return res.sendStatus(200)
      }

      const existing = await prisma.subscription.findFirst({
        where: { paddleSubId: data.id }
      })

      if (!existing) {
=======
      if (!userId) return res.sendStatus(200)

      const exists = await prisma.subscription.findFirst({
        where: { paddleSubId: data.id }
      })

      if (!exists) {
>>>>>>> 05d666d (fix prisma auto push)

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
<<<<<<< HEAD
    ========================================
    SUBSCRIPTION UPDATED
    ========================================
=======
    SUBSCRIPTION UPDATED
>>>>>>> 05d666d (fix prisma auto push)
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
<<<<<<< HEAD
    ========================================
    SUBSCRIPTION CANCELED
    ========================================
=======
    SUBSCRIPTION CANCELED
>>>>>>> 05d666d (fix prisma auto push)
    */

    if (event_type === "subscription.canceled") {

      await prisma.subscription.updateMany({
        where: { paddleSubId: data.id },
        data: { status: "canceled" }
      })

    }

<<<<<<< HEAD
    return res.sendStatus(200)

  } catch (error) {

    console.error("🔥 Paddle webhook error:", error)
    return res.sendStatus(500)
=======
    res.sendStatus(200)

  } catch (err) {

    console.error("🔥 Paddle webhook error:", err)
    res.sendStatus(500)
>>>>>>> 05d666d (fix prisma auto push)

  }

})

export default router
