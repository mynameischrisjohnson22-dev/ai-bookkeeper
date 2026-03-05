router.post("/webhook", async (req, res) => {

  const event = req.body

  if (event.event_type === "subscription.created") {

    await prisma.subscription.create({
      data: {
        userId: event.custom_data.userId,
        paddleSubId: event.data.id,
        plan: event.data.items[0].price.name,
        status: "active"
      }
    })
  }

  if (event.event_type === "subscription.canceled") {

    await prisma.subscription.update({
      where: { paddleSubId: event.data.id },
      data: { status: "canceled" }
    })
  }

  res.sendStatus(200)
})