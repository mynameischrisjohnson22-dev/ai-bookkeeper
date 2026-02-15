import express from "express"
import Stripe from "stripe"

const router = express.Router()

// Init Stripe with correct secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

// Map frontend plan → Stripe Price ID (from .env)
const PRICE_MAP = {
  basic_monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY,
  basic_yearly: process.env.STRIPE_PRICE_BASIC_YEARLY,
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
}

router.post("/checkout", async (req, res) => {
  try {
    const { plan, userId } = req.body

    console.log("🧾 Stripe checkout request:", { plan, userId })

    if (!plan || !userId) {
      return res.status(400).json({ error: "Missing plan or userId" })
    }

    const priceId = PRICE_MAP[plan]

    if (!priceId) {
      console.error("❌ Invalid plan:", plan)
      return res.status(400).json({ error: "Invalid plan" })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY not set")
      return res.status(500).json({ error: "Stripe not configured" })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/dashboard?success=1",
      cancel_url: "http://localhost:3000/dashboard?canceled=1",
      metadata: {
        userId,
        plan,
      },
    })

    console.log("✅ Stripe session created:", session.id)

    res.json({ url: session.url })
  } catch (err) {
    console.error("🔥 Stripe checkout error:", err)
    res.status(500).json({ error: "Stripe checkout failed" })
  }
})

export default router
