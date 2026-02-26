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

/* ================= DELETE ================= */

export const remove = async (userId, id) => {
  const transaction = await transactionRepository.remove(userId, id)

  await logAudit({
    userId,
    action: "DELETE",
    entity: "Transaction",
    entityId: id,
  })

  return transaction
}