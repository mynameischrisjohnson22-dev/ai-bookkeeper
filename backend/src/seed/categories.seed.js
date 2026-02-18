import prisma from "../utils/prisma.js"

export async function seedDefaultCategories() {
  const defaults = [
    { parent: "Income",   name: "Salary",      icon: "💵", isRevenue: true },
    { parent: "Income",   name: "Freelance",   icon: "🧑‍💻", isRevenue: true },
    { parent: "Income",   name: "Investments", icon: "📈", isRevenue: true },
    { parent: "Income",   name: "Dividends",   icon: "💰", isRevenue: true },

    { parent: "Expenses", name: "Expenses",    icon: "🛒" },

    { parent: "Other",    name: "Other",       icon: "📦" }
  ]

  for (const c of defaults) {
    const exists = await prisma.category.findFirst({
      where: {
        builtIn: true,
        parent: c.parent,
        name: c.name
      }
    })

    if (exists) continue

    await prisma.category.create({
      data: {
        parent: c.parent,
        name: c.name,
        icon: c.icon,
        builtIn: true,
        isRevenue: c.isRevenue ?? false,
        isCOGS: false
        // IMPORTANT:
        // do NOT send userId at all for built-in categories
      }
    })
  }

  console.log("✅ Default categories seeded")
}

