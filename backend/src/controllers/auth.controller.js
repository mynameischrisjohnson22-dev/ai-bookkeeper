import prisma from "../utils/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { sendVerificationEmail } from "../utils/email.js"

const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_EXPIRES_IN = "7d"

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing")
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//////////////////////////////////////////////////////
// SIGNUP
//////////////////////////////////////////////////////

export const signup = async (req, res) => {
  try {

    let { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    email = email.toLowerCase().trim()

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters"
      })
    }

    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      return res.status(409).json({ error: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const verificationToken = crypto.randomBytes(32).toString("hex")

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
        emailVerified: false
      }
    })

    await sendVerificationEmail(email, verificationToken)

    res.status(201).json({
      message: "Signup successful. Verify your email."
    })

  } catch (err) {
    console.error("Signup error:", err)
    res.status(500).json({ error: "Signup failed" })
  }
}

//////////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////////

export const login = async (req, res) => {
  try {

    let { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    email = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return res.status(401).json({
        error: "Invalid email or password"
      })
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return res.status(401).json({
        error: "Invalid email or password"
      })
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        error: "Please verify your email before logging in"
      })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt
      }
    })

  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ error: "Login failed" })
  }
}

//////////////////////////////////////////////////////
// VERIFY EMAIL
//////////////////////////////////////////////////////

export const verifyEmail = async (req, res) => {
  try {

    const { token } = req.query

    if (!token) {
      return res.status(400).json({
        error: "Verification token missing"
      })
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    })

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired verification token"
      })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null
      }
    })

    res.json({
      message: "Email verified successfully"
    })

  } catch (err) {
    console.error("Verify error:", err)
    res.status(500).json({ error: "Verification failed" })
  }
}

//////////////////////////////////////////////////////
// RESEND VERIFICATION
//////////////////////////////////////////////////////

export const resendVerification = async (req, res) => {
  try {

    let { email } = req.body

    if (!email) {
      return res.status(400).json({
        error: "Email required"
      })
    }

    email = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      })
    }

    if (user.emailVerified) {
      return res.status(400).json({
        error: "Email already verified"
      })
    }

    const verificationToken = crypto.randomBytes(32).toString("hex")

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken }
    })

    await sendVerificationEmail(email, verificationToken)

    res.json({
      message: "Verification email resent"
    })

  } catch (err) {
    console.error("Resend verification error:", err)
    res.status(500).json({
      error: "Failed to resend verification"
    })
  }
}