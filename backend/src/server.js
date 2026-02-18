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
    environment: process.env.NODE_ENV || "production",
  })
})

/* =================================
   SERVER
================================= */
const server = http.createServer(app)

/* =================================
   START SERVER
================================= */
async function startServer() {
  try {
    console.log("🔄 Starting backend...")

    // Connect DB
    await prisma.$connect()
    console.log("✅ Database connected")

    // Seed categories safely
    try {
      await seedDefaultCategories()
      console.log("✅ Default categories seeded")
    } catch (seedError) {
      console.error("⚠️ Seeding failed (continuing):", seedError)
    }

    // Start server
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on port ${PORT}`)
    })

    // Cron (optional)
    if (ENABLE_CRON) {
      console.log("⏰ Cron jobs enabled")

      cron.schedule("*/5 * * * *", async () => {
        try {
          console.log("Running recurring engine...")
          await runRecurringEngine()
        } catch (cronError) {
          console.error("❌ Cron error:", cronError)
        }
      })
    }

  } catch (error) {
    console.error("❌ Critical startup failure:", error)
    process.exit(1)
  }
}

/* =================================
   GLOBAL ERROR HANDLING
================================= */
process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason)
})

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err)
})

/* =================================
   GRACEFUL SHUTDOWN
================================= */
async function shutdown() {
  console.log("🛑 Shutting down gracefully...")

  try {
    await prisma.$disconnect()
  } catch (e) {
    console.error("Error during DB disconnect:", e)
  }

  server.close(() => {
    process.exit(0)
  })
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)

startServer()
