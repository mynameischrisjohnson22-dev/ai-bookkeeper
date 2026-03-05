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

/*
================================================
🔐 AUTH PROTECTION
All transaction routes require authentication
================================================
*/

router.use(authMiddleware)

/*
================================================
📥 FETCH TRANSACTIONS
================================================
*/

// GET all user transactions
// GET /api/transactions
router.get("/", getTransactionsController)

/*
================================================
➕ CREATE TRANSACTIONS
================================================
*/

// Create a single transaction
// POST /api/transactions
router.post("/", createTransactionController)

// Upload multiple transactions (CSV / bank import)
// POST /api/transactions/upload
router.post("/upload", uploadTransactionsController)

/*
================================================
🧹 RESET BUSINESS DATA
================================================
*/

// Delete ALL transactions for the business
// DELETE /api/transactions/business/reset
router.delete("/business/reset", resetBusinessController)

/*
================================================
❌ DELETE SINGLE TRANSACTION
================================================
*/

// Delete one transaction
// DELETE /api/transactions/:id
router.delete("/:id", deleteTransactionController)

export default router