import dotenv from "dotenv"
dotenv.config()

import cron from "node-cron"
import app from "./app.js"
import prisma from "./utils/prisma.js"
import { seedDefaultCategories } from "./seed/categories.seed.js"

const PORT = process.env.PORT || 4000

/* ================================
   START SERVER PROPERLY
================================ */

async function startServer() {
  try {
    // Ensure DB connection works
    await prisma.$connect()
    console.log("✅ Database connected")

    // Seed built-in categories (safe to run multiple times)
    await seedDefaultCategories()
    console.log("✅ Default categories seeded")

    // Start Express
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`)
    })

    /* ================================
       OPTIONAL CRON JOBS
    ================================= */
    if (process.env.ENABLE_CRON === "true") {
      const { runWeeklyDigest } = await import("./jobs/weeklyDigest.job.js")

      cron.schedule("0 8 * * 0", async () => {
        console.log("📬 Running weekly founder digest")
        await runWeeklyDigest()
      })

      console.log("⏰ Cron jobs enabled")
    }

  } catch (err) {
    console.error("❌ Server failed to start:", err)
    process.exit(1)
  }
}

startServer()
