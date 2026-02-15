import prisma from "../utils/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_EXPIRES_IN = "7d"

/* =========================
   SIGNUP
========================= */
export const signup = async (req, res) => {
  try {
    let { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    email = email.toLowerCase().trim()

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    const token = jwt.sign(
      {
        id: user.id,        // ✅ STANDARDIZED
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    )

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    })

  } catch (err) {
    console.error("Signup error:", err)
    res.status(500).json({ error: "Signup failed" })
  }
}

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    email = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const token = jwt.sign(
      {
        id: user.id,        // ✅ MUST MATCH middleware
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    })

  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ error: "Login failed" })
  }
}
