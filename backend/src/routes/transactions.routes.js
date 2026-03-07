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

router.use(authMiddleware)

router.get("/", getTransactionsController)

router.post("/", createTransactionController)

router.post("/upload", uploadTransactionsController)

router.delete("/business/reset", resetBusinessController)

router.delete("/:id", deleteTransactionController)

export default router