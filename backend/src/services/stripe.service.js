import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createCheckoutSession = async (user) => {
  return await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    customer_email: user.email,
    metadata: {
      userId: user.id,
    },
    success_url: "http://localhost:3000/dashboard?upgraded=true",
    cancel_url: "http://localhost:3000/dashboard?cancelled=true",
  })
}
