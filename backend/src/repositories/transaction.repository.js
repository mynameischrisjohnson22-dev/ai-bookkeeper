import prisma from "../utils/prisma.js"

/* ================= CREATE ================= */

export const create = async (userId, data) => {
  return prisma.transaction.create({
    data: {
      userId,
      ...data,
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
  return prisma.transaction.delete({
    where: {
      id,
    },
  })
}

/* ================= RESET BUSINESS ================= */

export const resetBusiness = async (userId) => {
  return prisma.transaction.deleteMany({
    where: {
      userId,
    },
  })
}