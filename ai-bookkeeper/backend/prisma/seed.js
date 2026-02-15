import prisma from "../src/utils/prisma.js"

const categories = [
  // 💰 Revenue
  { parent: "Revenue", name: "Product Sales", isRevenue: true },
  { parent: "Revenue", name: "Service Income", isRevenue: true },

  // 📦 COGS
  { parent: "COGS", name: "Inventory", isCOGS: true },
  { parent: "COGS", name: "Manufacturing", isCOGS: true },

  // 📣 Marketing
  { parent: "Marketing", name: "Ads" },
  { parent: "Marketing", name: "Software Tools" },

  // 🛠 Operations
  { parent: "Operations", name: "Software Subscriptions" },
  { parent: "Operations", name: "Professional Services" },

  // 👥 Team
  { parent: "Team", name: "Salaries" },
  { parent: "Team", name: "Contractors" },

  // 🧾 Taxes
  { parent: "Taxes", name: "Income Tax" },
  { parent: "Taxes", name: "Sales Tax" },
]

await prisma.category.createMany({ data: categories })
console.log("✅ Categories seeded")
process.exit()
