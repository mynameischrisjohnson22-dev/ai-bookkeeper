import * as transactionRepository from "../repositories/transaction.repository.js"
import { logAudit } from "../utils/audit.js"

/* ================= CREATE ================= */

export const create = async (userId, data) => {
  const transaction = await transactionRepository.create(userId, data)

  await logAudit({
    userId,
    action: "CREATE",
    entity: "Transaction",
    entityId: transaction.id,
  })

  return transaction
}

/* ================= GET ALL ================= */

export const getAll = async (userId) => {
  return transactionRepository.getAll(userId)
}

/* ================= DELETE (SAFE HARD DELETE) ================= */

export const remove = async (userId, id) => {
  // 🔥 This must NOT throw if not found
  const deleted = await transactionRepository.remove(userId, id)

  // Only log if something was deleted
  if (deleted) {
    await logAudit({
      userId,
      action: "DELETE",
      entity: "Transaction",
      entityId: id,
    })
  }

  return deleted
}