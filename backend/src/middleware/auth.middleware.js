import jwt from "jsonwebtoken"
import prisma from "../utils/prisma.js"

export const authMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const userAgent = req.headers["user-agent"] || "Unknown"

    req.user = {
      id: decoded.id,
      email: decoded.email
    }

    await prisma.user.update({
      where: { id: decoded.id },
      data: { lastActive: new Date() }
    })

    // ONLY store fields that exist in DB
    await prisma.session.create({
      data: {
        userId: decoded.id,
        device: userAgent
      }
    })

    next()

  } catch (err) {

    console.error("Auth middleware error:", err)

    return res.status(401).json({
      error: "Invalid or expired token"
    })

  }
}
