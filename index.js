import express from "express"
import mongoose from "mongoose"
import "dotenv/config"

import authRoutes from "./rauthRoutes.js"
import userRoutes from "./ruserRoutes.js"
import ticketRoutes from "./rticketRoutes.js"

const app = express()
app.use(express.json())

mongoose
  .connect(process.env.MONGO_DB_CONNECTION)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err))

app.use(authRoutes)
app.use(userRoutes)
app.use(ticketRoutes)

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT)
})
