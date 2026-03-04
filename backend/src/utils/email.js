import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`

  await resend.emails.send({
    from: "Albdy <no-reply@yourdomain.com>",
    to: email,
    subject: "Verify your Albdy account",
    html: `
      <h2>Welcome to Albdy</h2>
      <p>Click below to verify your account:</p>
      <a href="${verifyUrl}">Verify Account</a>
    `,
  })
}