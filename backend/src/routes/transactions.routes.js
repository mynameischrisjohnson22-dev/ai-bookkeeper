import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import {
  getTransactionsController,
  createTransactionController,
  deleteTransactionController,
  resetBusinessController,
  uploadTransactionsController
} from "../controllers/transactions.controller.js"

const router = Router()

// 🔐 Protect ALL transaction routes
router.use(authMiddleware)

/* ================= GET ================= */

// GET all transactions
router.get("/", getTransactionsController)

/* ================= CREATE ================= */

// CREATE transaction
router.post("/", createTransactionController)

// Upload transactions
router.post("/upload", uploadTransactionsController)

/* ================= DELETE ================= */

// RESET business transactions (PUT THIS FIRST)
router.delete("/business/reset", resetBusinessController)

// DELETE single transaction (PUT THIS LAST)
router.delete("/:id", deleteTransactionController)

export default router