import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"

const router = express.Router()

// SIGN UP
router.post("/signUp", async (req, res) => {
  const { name, email, password, money_balance } = req.body

  if (!email.includes("@")) return res.status(400).json({ message: "Invalid email" })
  if (password.length < 6 || !/\d/.test(password)) return res.status(400).json({ message: "Weak password" })

  const fixedName = name.charAt(0).toUpperCase() + name.slice(1)

  const hashed = await bcrypt.hash(password, 10)

  const user = await User.create({
    name: fixedName,
    email,
    password: hashed,
    money_balance,
    bought_tickets: [],
  })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" })
  const refresh = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "1d" })

  res.json({
    message: "Registracija sėkminga",
    jwt_token: token,
    jwt_refresh_token: refresh,
  })
})

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ message: "Blogas email arba slaptažodis" })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(404).json({ message: "Blogas email arba slaptažodis" })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" })
  const refresh = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "1d" })

  res.json({
    message: "Prisijungimas sėkmingas",
    jwt_token: token,
    jwt_refresh_token: refresh,
  })
})

// REFRESH TOKEN
router.post("/getNewJwtToken", (req, res) => {
  const { jwt_refresh_token } = req.body

  try {
    const decoded = jwt.verify(jwt_refresh_token, process.env.JWT_REFRESH_SECRET)

    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "2h" })

    res.json({
      jwt_token: newToken,
      jwt_refresh_token,
    })
  } catch {
    return res.status(400).json({ message: "Reikia prisijungti iš naujo" })
  }
})

export default router
