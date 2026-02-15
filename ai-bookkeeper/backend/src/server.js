import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import http from "http";
import app from "./app.js";
import prisma from "./utils/prisma.js";
import { seedDefaultCategories } from "./seed/categories.seed.js";

/* =================================
   HEALTH CHECK ROUTE
================================= */
app.get("/", (req, res) => {
  res.json({
    status: "AI Bookkeeper Backend Running",
    environment: process.env.NODE_ENV || "production",
  });
});

/* =================================
   START SERVER PROPERLY
================================= */

const PORT = process.env.PORT;

if (!PORT) {
  console.error("❌ PORT environment variable not defined");
  process.exit(1);
}

const server = http.createServer(app);

async function startServer() {
  try {
    // Connect to database
    await prisma.$connect();
    console.log("✅ Database connected");

    // Seed default categories (safe if already exists)
    await seedDefaultCategories();
    console.log("✅ Default categories seeded");

    // Start server (ONLY HERE — once)
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });

    /* =================================
       OPTIONAL CRON JOBS
    ================================= */
    if (process.env.ENABLE_CRON === "true") {
      const { runWeeklyDigest } = await import("./jobs/weeklyDigest.job.js");

      cron.schedule("0 8 * * 0", async () => {
        console.log("📬 Running weekly founder digest");
        await runWeeklyDigest();
      });

      console.log("⏰ Cron jobs enabled");
    }

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
}

/* =================================
   GRACEFUL SHUTDOWN
================================= */

async function shutdown() {
  console.log("🛑 Shutting down gracefully...");

  await prisma.$disconnect();

  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

startServer();
