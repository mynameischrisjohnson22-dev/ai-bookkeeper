import prisma from "../utils/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables")
}

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
        id: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    )

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    })

  } catch (err) {
    console.error("Signup error:", err)
    return res.status(500).json({ error: "Signup failed" })
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

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    )

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      }
    })

  } catch (err) {
    console.error("Login error:", err)
    return res.status(500).json({ error: "Login failed" })
  }
}
