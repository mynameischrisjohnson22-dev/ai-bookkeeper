import express from "express"
import cors from "cors"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import passport from "./utils/passport.js"

/* ---------- ROUTES ---------- */
import authRoutes from "./routes/auth.routes.js"
import transactionRoutes from "./routes/transactions.routes.js"
import categoriesRoutes from "./routes/categories.routes.js"
import metricsRoutes from "./routes/metrics.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import cfoRoutes from "./routes/cfo.routes.js"
import stripeRoutes from "./routes/stripe.routes.js"
import reportRoutes from "./routes/reports.routes.js"
import actionsRoutes from "./routes/actions.routes.js"

const app = express()

/* ======================================================
   SECURITY: RATE LIMITING
====================================================== */

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(globalLimiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many auth attempts. Try again later." }
})

app.use("/api/auth", authLimiter)

/* ======================================================
   CORS
====================================================== */

const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-bookkeeper-jade.vercel.app",
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (origin.includes(".vercel.app")) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      console.log("❌ CORS blocked:", origin)
      return callback(null, false)
    },
    credentials: true,
  })
)

app.options("*", cors())

/* ======================================================
   CORE
====================================================== */

app.use(express.json({ limit: "10mb" }))
app.use(morgan("dev"))
app.use(passport.initialize())

/* ======================================================
   ROUTES
====================================================== */

app.use("/api/auth", authRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/metrics", metricsRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/cfo", cfoRoutes)
app.use("/api/stripe", stripeRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/actions", actionsRoutes)

app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.use((err, _req, res, _next) => {
  console.error("🔥 Unhandled error:", err)
  res.status(500).json({ error: "Internal server error" })
})

export default app