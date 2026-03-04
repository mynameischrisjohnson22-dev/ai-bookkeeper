import prisma from "../utils/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { sendVerificationEmail } from "../utils/email.js"

const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_EXPIRES_IN = "7d"

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables")
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* =========================
   SIGNUP
========================= */
export const signup = async (req, res) => {
  try {
    let { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      })
    }

    email = email.toLowerCase().trim()

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format"
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters"
      })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex")

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
        emailVerified: false
      }
    })

    await sendVerificationEmail(email, verificationToken)

    return res.status(201).json({
      message: "Signup successful. Please verify your email."
    })

  } catch (error) {
    console.error("Signup error:", error)
    return res.status(500).json({
      error: "Signup failed"
    })
  }
}


/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      })
    }

    email = email.toLowerCase().trim()

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format"
      })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return res.status(401).json({
        error: "Invalid email or password"
      })
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
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
        plan: user.plan,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({
      error: "Login failed"
    })
  }
}
/* =========================
   VERIFY EMAIL
========================= */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({
        error: "Invalid verification token"
      })
    }

    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    })

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token"
      })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null
      }
    })

    return res.status(200).json({
      message: "Email verified successfully"
    })

  } catch (err) {
    console.error("Verify email error:", err)
    return res.status(500).json({
      error: "Verification failed"
    })
  }
}
/* =========================
   RESEND VERIFICATION
========================= */
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        error: "Email is required"
      })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user) {
      return res.status(400).json({
        error: "User not found"
      })
    }

    if (user.emailVerified) {
      return res.status(400).json({
        error: "Email already verified"
      })
    }

    const newToken = crypto.randomBytes(32).toString("hex")

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: newToken }
    })

    await sendVerificationEmail(user.email, newToken)

    return res.status(200).json({
      message: "Verification email resent"
    })

  } catch (err) {
    console.error("Resend verification error:", err)
    return res.status(500).json({
      error: "Failed to resend verification"
    })
  }
}
/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        error: "Email is required"
      })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link was sent"
      })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetExpires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      }
    })

    await sendResetPasswordEmail(user.email, resetToken)

    return res.status(200).json({
      message: "If that email exists, a reset link was sent"
    })

  } catch (err) {
    console.error("Forgot password error:", err)
    return res.status(500).json({
      error: "Failed to process request"
    })
  }
}
/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        error: "Token and new password required"
      })
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    })

    return res.status(200).json({
      message: "Password reset successful"
    })

  } catch (err) {
    console.error("Reset password error:", err)
    return res.status(500).json({
      error: "Password reset failed"
    })
  }
}