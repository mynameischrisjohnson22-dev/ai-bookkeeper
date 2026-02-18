import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import {
  getTransactionsController,
  createTransactionController,
  deleteTransactionController,
  resetBusinessController,
  uploadTransactionsController
} from "../controllers/transactions.controller.js" // ✅ plural

const router = Router()

// 🔐 Protect all routes
router.use(authMiddleware)

// Routes
router.get("/", getTransactionsController)
router.post("/", createTransactionController)
router.delete("/:id", deleteTransactionController)
router.delete("/business/reset", resetBusinessController)
router.post("/upload", uploadTransactionsController)

export default router
