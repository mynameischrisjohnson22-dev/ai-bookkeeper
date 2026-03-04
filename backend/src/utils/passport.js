import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import prisma from "./prisma.js"

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value
        const googleId = profile.id

        let user = await prisma.user.findUnique({
          where: { email }
        })

        // If user doesn't exist, create one
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