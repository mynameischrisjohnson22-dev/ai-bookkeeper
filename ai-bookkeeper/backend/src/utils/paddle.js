import { Paddle } from "@paddle/paddle-node-sdk"

export const paddle = new Paddle({
  apiKey: process.env.PADDLE_API_KEY,
  environment:
    process.env.PADDLE_ENV === "production"
      ? "production"
      : "sandbox"
})
