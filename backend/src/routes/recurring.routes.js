import { Router } from "express"
import prisma from "../utils/prisma.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

router.use(authMiddleware)

//////////////////////////////////////////////////////
// GET RECURRING
//////////////////////////////////////////////////////

router.get("/", async (req,res)=>{

  const rules = await prisma.recurringTransaction.findMany({
    where:{ userId:req.user.id },
    orderBy:{ nextRun:"asc" }
  })

  res.json(rules)

})

//////////////////////////////////////////////////////
// CREATE RECURRING
//////////////////////////////////////////////////////

router.post("/", async (req,res)=>{

  const { name, amount, frequency, categoryId } = req.body

  const recurring = await prisma.recurringTransaction.create({
    data:{
      userId:req.user.id,
      name,
      amount:Number(amount),
      frequency,
      categoryId,
      nextRun:new Date()
    }
  })

  res.json(recurring)

})

//////////////////////////////////////////////////////
// DELETE RECURRING
//////////////////////////////////////////////////////

router.delete("/:id", async (req,res)=>{

  await prisma.recurringTransaction.delete({
    where:{ id:req.params.id }
  })

  res.json({ success:true })

})

export default router