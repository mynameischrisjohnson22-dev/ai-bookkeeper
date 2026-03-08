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

    // Extract device + IP safely
    const userAgent = req.headers["user-agent"] || "Unknown"
    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      null

    req.user = {
      id: decoded.id,
      email: decoded.email
    }

    // Update user's last active time
    await prisma.user.update({
      where: { id: decoded.id },
      data: { lastActive: new Date() }
    })

    // Store session
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
