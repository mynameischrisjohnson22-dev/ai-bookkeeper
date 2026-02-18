import prisma from "./prisma.js"

export const logAudit = async ({
  userId,
  action,
  entity,
  entityId
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId
      }
    })
  } catch (err) {
    console.error("AUDIT LOG ERROR:", err)
  }
}
