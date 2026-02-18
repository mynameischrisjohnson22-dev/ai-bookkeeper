import prisma from "../utils/prisma.js"

export const runRecurringEngine = async () => {
  const now = new Date()

  const rules = await prisma.recurringRule.findMany({
    where: {
      active: true,
      nextRun: { lte: now }
    }
  })

  for (const rule of rules) {
    await prisma.transaction.create({
      data: {
        userId: rule.userId,
        description: rule.type,
        amount: rule.amount,
        date: now
      }
    })

    await prisma.recurringRule.update({
      where: { id: rule.id },
      data: {
        nextRun: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      }
    })
  }
}
