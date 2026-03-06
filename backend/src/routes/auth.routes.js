import express from "express"
import passport from "../utils/passport.js"
import jwt from "jsonwebtoken"

import {
  signup,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js"

const router = express.Router()

////////////////////////////////////////////////////
// EMAIL AUTH
////////////////////////////////////////////////////

router.post("/signup", signup)
router.post("/login", login)

router.get("/verify-email", verifyEmail)
router.post("/resend-verification", resendVerification)

router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

////////////////////////////////////////////////////
// GOOGLE AUTH
////////////////////////////////////////////////////

router.get(
  "/google",
  passport.authenticate("google",{
    scope:["profile","email"],
    session:false
  })
)

router.get(
  "/google/callback",
  passport.authenticate("google",{
    session:false,
    failureRedirect:`${process.env.FRONTEND_URL}/login`
  }),
  (req,res)=>{

    const token = jwt.sign(
      { id:req.user.id,email:req.user.email },
      process.env.JWT_SECRET,
      { expiresIn:"7d" }
    )

    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
    )

  }
)

export default router