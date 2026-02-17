import dotenv from "dotenv"
dotenv.config()

import http from "http"
import cron from "node-cron"
import app from "./app.js"
import prisma from "./utils/prisma.js"
import { seedDefaultCategories } from "./seed/categories.seed.js"
import { runRecurringEngine } from "./jobs/recurring.engine.js"

/* =================================
   CONFIG
================================= */
const PORT = process.env.PORT || 8080
const ENABLE_CRON = process.env.ENABLE_CRON === "true"

/* =================================
   HEALTH CHECK
================================= */
app.get("/", (req, res) => {
  res.json({
    status: "AI Bookkeeper Backend Running",
    environment: process.env.NODE_ENV || "production"
  })
})

/* =================================
   SERVER INSTANCE
================================= */
const server = http.createServer(app)

/* =================================
   START SERVER
================================= */
async function startServer() {
  try {
    await prisma.$connect()
    console.log("✅ Database connected")

    await seedDefaultCategories()
    console.log("✅ Default categories seeded")

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on port ${PORT}`)
    })

    if (ENABLE_CRON) {
      console.log("⏰ Cron jobs enabled")

      cron.schedule("*/5 * * * *", async () => {
        console.log("Running recurring engine...")
        await runRecurringEngine()
      })
    }

  } catch (error) {
    console.error("❌ Server failed to start:", error)
    process.exit(1)
  }
}

/* =================================
   GRACEFUL SHUTDOWN
================================= */
async function shutdown() {
  console.log("🛑 Shutting down gracefully...")

  await prisma.$disconnect()

  server.close(() => {
    process.exit(0)
  })
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)

startServer()
