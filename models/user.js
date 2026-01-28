import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  money_balance: Number,
  bought_tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
})

export default mongoose.model("User", userSchema)
