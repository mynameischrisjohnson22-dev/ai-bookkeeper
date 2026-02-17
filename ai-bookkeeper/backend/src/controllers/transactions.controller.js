import {
  getTransactionsController,
  createTransactionController,
  deleteTransactionController,
  resetBusinessController,
  uploadTransactionsController
} from "../controllers/transactions.controller.js"


/* =========================================
   GET TRANSACTIONS
========================================= */
export const getTransactionsController = async (req, res) => {
  try {
    const transactions = await transactionService.getAll(req.user.id)
    res.json(transactions)
  } catch (error) {
    console.error("GET TRANSACTIONS ERROR:", error)
    res.status(500).json({ error: "Failed to fetch transactions" })
  }
}


/* =========================================
   CREATE TRANSACTION
========================================= */
export const createTransactionController = async (req, res) => {
  try {
    const { date, description, amount } = req.body

    if (!date || !description || amount === undefined) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const transaction = await transactionService.create(
      req.user.id,
      req.body
    )

    res.json(transaction)
  } catch (error) {
    console.error("CREATE TRANSACTION ERROR:", error)
    res.status(500).json({ error: "Failed to create transaction" })
  }
}


/* =========================================
   DELETE TRANSACTION (SOFT)
========================================= */
export const deleteTransactionController = async (req, res) => {
  try {
    await transactionService.softDelete(req.user.id, req.params.id)
    res.json({ success: true })
  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error)
    res.status(500).json({ error: "Failed to delete transaction" })
  }
}


/* =========================================
   RESET BUSINESS
========================================= */
export const resetBusinessController = async (req, res) => {
  try {
    await transactionService.reset(req.user.id)
    res.json({ success: true })
  } catch (error) {
    console.error("RESET BUSINESS ERROR:", error)
    res.status(500).json({ error: "Failed to reset business data" })
  }
}


/* =========================================
   CSV UPLOAD
========================================= */
export const uploadTransactionsController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const result = await transactionService.uploadCSV(
      req.user.id,
      req.file
    )

    res.json(result)
  } catch (error) {
    console.error("UPLOAD ERROR:", error)
    res.status(500).json({ error: "CSV upload failed" })
  }
}