import prisma from "../utils/prisma.js"

/* ================= CREATE ================= */

export const create = async (userId, data) => {
  const { date, description, amount, categoryId } = data

  return prisma.transaction.create({
    data: {
      userId,
      date: new Date(date),            // 🔥 force correct Date type
      description: description?.trim(),
      amount: Number(amount),          // 🔥 force number
      categoryId: categoryId || null   // 🔥 prevent undefined
    },
  })
}

/* ================= GET ALL ================= */

export const getAll = async (userId) => {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  })
}

/* ================= DELETE ================= */

export const remove = async (userId, id) => {
  return prisma.transaction.deleteMany({
    where: {
      id,
      userId,   // 🔥 prevent deleting other user's data
    },
  })
}

/* ================= RESET BUSINESS ================= */

export const reset = async (userId) => {
  return prisma.transaction.deleteMany({
    where: {
      userId,
    },
  })
}