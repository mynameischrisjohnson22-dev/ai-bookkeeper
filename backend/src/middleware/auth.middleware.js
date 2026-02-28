import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" })
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid authorization format" })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Token missing" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // ✅ Keep this consistent everywhere
    req.user = {
      userId: decoded.id,
      email: decoded.email
    }

    next()
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token"
    })
  }
}
