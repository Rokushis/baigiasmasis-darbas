import express from "express"
import Ticket from "../models/ticket.js"
import User from "../models/user.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()

// BUY TICKET
router.post("/buyTicket", auth, async (req, res) => {
  const { user_id, title, ticket_price, from_location, to_location, to_location_photo_url } = req.body

  const user = await User.findById(user_id)
  if (!user) return res.status(404).json({ message: "User not found" })

  if (user.money_balance < ticket_price) return res.status(400).json({ message: "Nepakanka pinigų" })

  const ticket = await Ticket.create({
    title,
    userId: user_id,
    ticket_price,
    from_location,
    to_location,
    to_location_photo_url,
  })

  user.bought_tickets.push(ticket._id)
  user.money_balance -= ticket_price
  await user.save()

  res.json({ message: "Bilietas nupirktas", ticket })
})

// GET ALL USERS WITH TICKETS
router.get("/getAllUsersWithTickets", auth, async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "tickets",
        localField: "bought_tickets",
        foreignField: "_id",
        as: "tickets",
      },
    },
  ])

  res.json(users)
})

// GET USER BY ID WITH TICKETS
router.get("/getUserByIdWithTickets/:id", auth, async (req, res) => {
  const users = await User.aggregate([
    { $match: { _id: req.params.id } },
    {
      $lookup: {
        from: "tickets",
        localField: "bought_tickets",
        foreignField: "_id",
        as: "tickets",
      },
    },
  ])

  res.json(users[0] || {})
})

export default router
