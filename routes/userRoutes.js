import express from "express"
import User from "../models/user.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// GET ALL USERS
router.get("/getAllUsers", auth, async (req, res) => {
  const users = await User.find().sort({ name: 1 })
  res.json(users)
})

// GET USER BY ID
router.get("/getUserById/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: "User not found" })
  res.json(user)
})

export default router
