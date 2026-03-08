import prisma from "../utils/prisma.js"

export const getSessions = async (req, res) => {

  try {

    const sessions = await prisma.session.findMany({
      where: { userId: req.user.id },
      orderBy: { lastActive: "desc" }
    })

    res.json(sessions)

  } catch (error) {

    console.error("Get sessions error:", error)

    res.status(500).json({
      error: "Failed to fetch sessions"
    })

  }

}