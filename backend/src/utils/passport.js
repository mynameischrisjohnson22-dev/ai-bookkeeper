import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import prisma from "./prisma.js"

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  API_URL
} = process.env

if (!GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID not set")
if (!GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_CLIENT_SECRET not set")
if (!API_URL) throw new Error("API_URL not set")

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${API_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        const googleId = profile.id

        if (!email) {
          return done(new Error("Google account has no email"), null)
        }

        /* 1️⃣ Check if Google account already exists */
        let user = await prisma.user.findUnique({
          where: { googleId }
        })

        if (user) {
          return done(null, user)
        }

        /* 2️⃣ Check if user already exists with same email */
        user = await prisma.user.findUnique({
          where: { email }
        })

        if (user) {
          /* Attach Google login to existing account */
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId,
              emailVerified: true
            }
          })

          return done(null, user)
        }

        /* 3️⃣ Create new user */
        user = await prisma.user.create({
          data: {
            email,
            googleId,
            emailVerified: true,
            password: null
          }
        })

        return done(null, user)

      } catch (error) {
        console.error("Google Auth Error:", error)
        return done(error, null)
      }
    }
  )
)

export default passport