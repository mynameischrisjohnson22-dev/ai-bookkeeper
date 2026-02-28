import express from "express"
import cors from "cors"
import morgan from "morgan"

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
   CORS (SIMPLIFIED + SAFE)
====================================================== */

const allowedOrigins = [
  "http://localhost:3000",
  "https://albdy.com",
  "https://www.albdy.com",
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or Postman
      if (!origin) return callback(null, true)

      // Allow all Vercel deployments automatically
      if (origin.includes(".vercel.app")) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      console.log("❌ CORS blocked:", origin)

      // IMPORTANT: Do NOT throw error (causes 502)
      return callback(null, false)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

/* ---- VERY IMPORTANT FOR PREFLIGHT ---- */
app.options("*", cors())

/* ---------- MIDDLEWARE ---------- */
app.use(express.json())
app.use(morgan("dev"))

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/metrics", metricsRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/cfo", cfoRoutes)
app.use("/api/stripe", stripeRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/actions", actionsRoutes)

/* ---------- HEALTH ---------- */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

export default app