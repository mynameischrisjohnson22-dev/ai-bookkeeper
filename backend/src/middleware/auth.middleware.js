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
    
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      null

    req.user = {
      id: decoded.id,
      email: decoded.email
    }

    // update user last active
    await prisma.user.update({
      where: { id: decoded.id },
      data: { lastActive: new Date() }
    })

    // create/update session
    await prisma.session.create({
      data: {
        userId: decoded.id,
        device: userAgent,
        ipAddress,
        userAgent
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
