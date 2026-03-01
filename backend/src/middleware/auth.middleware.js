import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 🔥 FIX — support BOTH id and userId
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email
    }

    if (!req.user.id) {
      return res.status(401).json({ error: "Invalid token payload" })
    }

    next()

  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}