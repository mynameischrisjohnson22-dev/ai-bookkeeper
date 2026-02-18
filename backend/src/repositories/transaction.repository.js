import prisma from "../utils/prisma.js"

export const create = (userId, data) => {
  return prisma.transaction.create({
    data: {
      userId,
      ...data
    }
  })
}
