import dotenv from "dotenv"
dotenv.config()

import express from "express"
import http from "http"
import cron from "node-cron"

import app from "./app.js"
import prisma from "./utils/prisma.js"

/* ROUTES */
import authRoutes from "./routes/auth.routes.js"
import categoriesRoutes from "./routes/categories.routes.js"
import billingRoutes from "./routes/billing.routes.js"
import paddleRoutes from "./routes/paddle.routes.js"
import transactionRoutes from "./routes/transactions.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"

/* JOBS */
import { seedDefaultCategories } from "./seed/categories.seed.js"
import { runRecurringEngine } from "./jobs/recurring.engine.js"

const PORT = process.env.PORT || 3000
const ENABLE_CRON = process.env.ENABLE_CRON === "true"

/* ========================================
   PROXY CONFIG (Railway / Render / Heroku)
======================================== */

app.set("trust proxy", 1)

/* ========================================
   MIDDLEWARE
======================================== */

app.use(express.json({ limit: "2mb" }))

/* ========================================
   HEALTH CHECK
======================================== */

app.get("/", (req, res) => {
  res.json({
    status: "AI Bookkeeper Backend Running",
    environment: process.env.NODE_ENV || "production"
  })
})

/* ========================================
   API ROUTES
======================================== */

app.use("/api/auth", authRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/billing", billingRoutes)
app.use("/api/paddle", paddleRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/dashboard", dashboardRoutes)

/* ========================================
   CREATE SERVER
======================================== */

const server = http.createServer(app)

/* ========================================
   START SERVER
======================================== */

async function startServer() {
  try {

    console.log("🔄 Starting backend...")

    /* CONNECT DATABASE */

    await prisma.$connect()
    console.log("✅ Database connected")

    /* SEED DEFAULT CATEGORIES */

    try {
      await seedDefaultCategories()
      console.log("✅ Default categories seeded")
    } catch (err) {
      console.warn("⚠️ Category seed skipped:", err.message)
    }

    /* START HTTP SERVER */

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on port ${PORT}`)
    })

    /* CRON JOBS */

    if (ENABLE_CRON) {
      console.log("⏰ Cron jobs enabled")

      cron.schedule("*/5 * * * *", async () => {
        try {
          console.log("🔁 Running recurring engine...")
          await runRecurringEngine()
        } catch (err) {
          console.error("❌ Cron job error:", err)
        }
      })
    }

  } catch (error) {
    console.error("❌ Critical startup failure:", error)
    process.exit(1)
  }
}

/* ========================================
   GLOBAL ERROR HANDLERS
======================================== */

process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason)
})

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err)
})

/* ========================================
   GRACEFUL SHUTDOWN
======================================== */

async function shutdown(signal) {

  console.log(`🛑 ${signal} received. Shutting down...`)

  try {

    await prisma.$disconnect()

    server.close(() => {
      console.log("✅ Server closed")
      process.exit(0)
    })

  } catch (error) {

    console.error("Shutdown error:", error)
    process.exit(1)

  }
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)

/* ========================================
   START APP
======================================== */

startServer()