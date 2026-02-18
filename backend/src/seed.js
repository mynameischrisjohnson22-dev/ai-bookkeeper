// backend/src/seed.js
import prisma from "./utils/prisma.js"

async function seed() {
  await prisma.user.upsert({
    where: { email: "demo@test.com" },
    update: {},
    create: {
      id: "demo123",
      email: "demo@test.com",
      password: "temp",
      plan: "basic"
    }
  })

  console.log("✅ Seeded demo user")
}

seed()
  .catch(e => {
    console.error("❌ Seed failed", e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
