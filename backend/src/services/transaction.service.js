import * as transactionRepository from "../repositories/transaction.repository.js"
import { logAudit } from "../utils/audit.js"

export const create = async (userId, data) => {

  const transaction = await transactionRepository.create(userId, data)

  await logAudit({
    userId,
    action: "CREATE",
    entity: "Transaction",
    entityId: transaction.id
  })

  return transaction
}
