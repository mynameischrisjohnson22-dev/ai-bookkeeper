import express from "express"
import prisma from "../utils/prisma.js"
import auth from "../middleware/auth.js"

const router = express.Router()

/////////////////////////////////////////////////////
// GET PROFILE
/////////////////////////////////////////////////////

router.get("/profile", auth, async (req,res)=>{

  const user = await prisma.user.findUnique({
    where:{ id:req.user.id },
    select:{
      email:true,
      businessName:true,
      currency:true
    }
  })

  res.json(user)

})

/////////////////////////////////////////////////////
// UPDATE PROFILE
/////////////////////////////////////////////////////

router.patch("/profile", auth, async (req,res)=>{

  const { businessName,currency } = req.body

  const user = await prisma.user.update({
    where:{ id:req.user.id },
    data:{ businessName,currency }
  })

  res.json(user)

})

/////////////////////////////////////////////////////
// DELETE ACCOUNT
/////////////////////////////////////////////////////

router.delete("/delete", auth, async (req,res)=>{

  await prisma.user.update({
    where:{ id:req.user.id },
    data:{ deletedAt:new Date() }
  })

  res.json({ success:true })

})

export default router