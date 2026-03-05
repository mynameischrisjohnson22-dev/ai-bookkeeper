export default async function requireSubscription(req, res, next) {

  const userId = req.user.id

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "active"
    }
  })

  if (!subscription) {
    return res.status(403).json({
      error: "Active subscription required"
    })
  }

  next()
}