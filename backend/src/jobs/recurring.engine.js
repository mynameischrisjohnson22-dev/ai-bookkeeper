import prisma from "../utils/prisma.js"

export const runRecurringEngine = async () => {

  const now = new Date()

  const rules = await prisma.recurringTransaction.findMany({
    where: {
      active: true,
      nextRun: {
        lte: now
      }
    }
  })

  for (const rule of rules) {

    await prisma.transaction.create({
      data: {
        userId: rule.userId,
        description: rule.name,
        amount: rule.amount,
        categoryId: rule.categoryId
      }
    })

    let nextRun = new Date(rule.nextRun)

    if (rule.frequency === "monthly") {
      nextRun.setMonth(nextRun.getMonth() + 1)
    }

    if (rule.frequency === "weekly") {
      nextRun.setDate(nextRun.getDate() + 7)
    }

    if (rule.frequency === "yearly") {
      nextRun.setFullYear(nextRun.getFullYear() + 1)
    }

    await prisma.recurringTransaction.update({
      where: { id: rule.id },
      data: { nextRun }
    })

  }

}