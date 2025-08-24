// In your booking routes file
import express from "express"
import isAuth from "../middleware/isAuth.js"
import { cancelBooking, createBooking, getUserBookings } from "../controllers/booking.controller.js"

const bookingRouter = express.Router()

bookingRouter.post("/create/:id", isAuth, createBooking)
bookingRouter.delete("/cancel/:id", isAuth, cancelBooking)
bookingRouter.get("/my-bookings", isAuth, getUserBookings) // Add this line

export default bookingRouter
