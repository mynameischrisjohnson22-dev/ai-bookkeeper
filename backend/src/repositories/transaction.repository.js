import prisma from "../utils/prisma.js"

/* ================= CREATE ================= */

export const create = async (userId, data) => {
const { date, description, amount, categoryId, isRecurring, recurringFrequency } = data

  return prisma.transaction.create({
  data: {
    userId,
    date: new Date(date),
    description: description?.trim() || "",
    amount: Number(amount),
    categoryId: categoryId || null,
    isRecurring: isRecurring || false,
    recurringFrequency: recurringFrequency || null
  },
})
}


/* ================= GET ALL ================= */

export const getAll = async (userId) => {
  return prisma.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  })
}


/* ================= DELETE (SAFE) ================= */

export const remove = async (userId, id) => {
  const result = await prisma.transaction.deleteMany({
    where: {
      id,
      userId,
    },
  })

  // Return boolean instead of raw prisma object
  return result.count > 0
}


/* ================= RESET BUSINESS ================= */

export const reset = async (userId) => {
  const result = await prisma.transaction.deleteMany({
    where: {
      userId,
    },
  })

  return result.count
}