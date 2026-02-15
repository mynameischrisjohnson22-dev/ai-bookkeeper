import express from "express"
import Stripe from "stripe"
import prisma from "../utils/prisma.js"
import stripeWebhook from "./routes/stripe.webhook.js"

app.use("/stripe", stripeWebhook)

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"]

    let event

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error("Webhook signature error:", err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const { userId, plan } = session.metadata

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan,
          stripeCustomerId: session.customer,
          subscriptionStatus: "active"
        }
      })
    }

    res.json({ received: true })
  }
)

export default router
