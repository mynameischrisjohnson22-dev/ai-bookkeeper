import jwt from "jsonwebtoken"

export default function auth(req, res, next) {

  try {

    const authHeader = req.headers.authorization

    // No token
    if (!authHeader) {
      return res.status(401).json({
        error: "Authentication required"
      })
    }

    // Invalid format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid authorization format"
      })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({
        error: "Token missing"
      })
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded?.id) {
      return res.status(401).json({
        error: "Invalid token payload"
      })
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    }

    next()

  } catch (err) {

    console.error("Auth error:", err.message)

    return res.status(401).json({
      error: "Invalid or expired token"
    })

  }

}