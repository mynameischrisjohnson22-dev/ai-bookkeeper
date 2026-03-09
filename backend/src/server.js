import dotenv from "dotenv"
dotenv.config()

import http from "http"
import express from "express"

import app from "./app.js"
import prisma from "./utils/prisma.js"

/* ROUTES */

import authRoutes from "./routes/auth.routes.js"
import sessionRoutes from "./routes/session.routes.js"
import userRoutes from "./routes/user.routes.js"
import categoriesRoutes from "./routes/categories.routes.js"
import billingRoutes from "./routes/billing.routes.js"
import paddleRoutes from "./routes/paddle.routes.js"
import transactionRoutes from "./routes/transactions.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js"

/* JOBS */

import { seedDefaultCategories } from "./seed/categories.seed.js"
import { runRecurringEngine } from "./jobs/recurring.engine.js"
import { startRecurringRunner } from "./jobs/recurringRunner.job.js"

/* CONFIG */

const PORT = process.env.PORT || 3000
const ENABLE_CRON = process.env.ENABLE_CRON === "true"

/* =================================
   TRUST PROXY (Railway / Render)
================================= */

app.set("trust proxy", 1)

/* =================================
   MIDDLEWARE
================================= */

app.use(express.json({ limit: "2mb" }))

/* =================================
   HEALTH CHECK
================================= */

app.get("/", (req, res) => {
  res.json({
    status: "Albdy Backend Running",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString()
  })
})

/* =================================
   API ROUTES
================================= */

app.use("/api/auth", authRoutes)
app.use("/api", sessionRoutes)
app.use("/api/user", userRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/billing", authMiddleware, billingRoutes)
app.use("/api/paddle", paddleRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/dashboard", dashboardRoutes)

/* =================================
   CREATE SERVER
================================= */

const server = http.createServer(app)

/* =================================
   START SERVER
================================= */

async function startServer() {

  try {

    console.log("🔄 Starting Albdy backend...")

    await prisma.$connect()
    console.log("✅ Database connected")

    try {
      await seedDefaultCategories()
      console.log("✅ Default categories seeded")
    } catch (err) {
      console.warn("⚠️ Category seed skipped:", err.message)
    }

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })

    if (ENABLE_CRON) {

      console.log("⏰ Background jobs enabled")

      startRecurringRunner()

      await runRecurringEngine()

    }

  } catch (err) {

    console.error("❌ Server startup failed:", err)
    process.exit(1)

  }

}

/* =================================
   GLOBAL ERROR HANDLING
================================= */

process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Promise Rejection:", err)
})

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err)
})

/* =================================
   GRACEFUL SHUTDOWN
================================= */

async function shutdown(signal) {

  console.log(`🛑 ${signal} received. Shutting down...`)

  try {

    await prisma.$disconnect()

    server.close(() => {
      console.log("✅ Server closed")
      process.exit(0)
    })

  } catch (err) {

    console.error("Shutdown error:", err)
    process.exit(1)

  }

}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

/* =================================
   START APP
================================= */

startServer()