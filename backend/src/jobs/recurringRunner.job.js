import prisma from "../utils/prisma.js"

export async function runRecurring() {
  const now = new Date()

  const due = await prisma.recurringEntry.findMany({
    where: { nextRun: { lte: now } }
  })

  for (const r of due) {
    await prisma.transaction.create({
      data: {
        userId: r.userId,
        date: now,
        description: r.description,
        amount: r.amount,
        categoryId: r.categoryId
      }
    })

    const next = new Date(r.nextRun)

    if (r.cadence === "monthly") next.setMonth(next.getMonth() + 1)
    if (r.cadence === "weekly") next.setDate(next.getDate() + 7)
    if (r.cadence === "yearly") next.setFullYear(next.getFullYear() + 1)

    await prisma.recurringEntry.update({
      where: { id: r.id },
      data: { nextRun: next }
    })
  }
}
