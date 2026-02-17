import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import * as transactionController from "../controllers/transaction.controller.js"

const router = Router()

// 🔐 Protect everything
router.use(authMiddleware)

router.get("/", transactionController.getTransactionsController)
router.post("/", transactionController.createTransactionController)
router.delete("/:id", transactionController.deleteTransactionController)
router.delete("/business/reset", transactionController.resetBusinessController)
router.post("/upload", transactionController.uploadTransactionsController)

export default router

