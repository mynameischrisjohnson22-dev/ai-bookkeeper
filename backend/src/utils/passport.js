import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import prisma from "./prisma.js"

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID not set")
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET not set")
}

if (!process.env.API_URL) {
  throw new Error("API_URL not set in environment variables")
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        const googleId = profile.id

        if (!email) {
          return done(new Error("Google account has no email"), null)
        }

        let user = await prisma.user.findUnique({
          where: { email }
        })

        // Create new user if not exists
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              googleId,
              emailVerified: true,
              password: null,
            }
          })
        }

        return done(null, user)

      } catch (error) {
        return done(error, null)
      }
    }
  )
)

export default passport