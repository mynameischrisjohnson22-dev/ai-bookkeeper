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

// GET all transactions
router.get("/", getTransactionsController)

// CREATE transaction (used by Save Business Numbers)
router.post("/", createTransactionController)

// DELETE single transaction
router.delete("/:id", deleteTransactionController)

// RESET business transactions
router.delete("/business/reset", resetBusinessController)

// Upload transactions
router.post("/upload", uploadTransactionsController)

export default router