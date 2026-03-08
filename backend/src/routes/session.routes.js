import express from "express"
import { getSessions } from "../controllers/session.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/sessions", authMiddleware, getSessions)

export default router