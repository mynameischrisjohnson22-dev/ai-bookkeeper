import prisma from "../utils/prisma.js"
import { createCheckoutSession } from "../services/stripe.service.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createCheckout = async (req, res) => {
  try {
    const userId = req.user.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    const session = await createCheckoutSession(user)

    res.json({ url: session.url })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    res.status(500).json({ error: "Stripe checkout failed" })
  }
}

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]

  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error("Webhook signature failed.", err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    const userId = session.metadata.userId

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "PRO",
        stripeId: session.customer,
      },
    })
  }

  res.json({ received: true })
}
