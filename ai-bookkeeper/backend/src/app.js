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

/* ---------- MIDDLEWARE ---------- */
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes)
app.use("/transactions", transactionRoutes)
app.use("/categories", categoriesRoutes)
app.use("/metrics", metricsRoutes)
app.use("/ai", aiRoutes)
app.use("/cfo", cfoRoutes)
app.use("/stripe", stripeRoutes)
app.use("/reports", reportRoutes)
app.use("/actions", actionsRoutes)

/* ---------- HEALTH ---------- */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

export default app
