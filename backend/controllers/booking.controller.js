import Booking from "../model/booking.model.js"
import Listing from "../model/listing.model.js"
import User from "../model/user.model.js"

export const createBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut, totalRent } = req.body;
        
        console.log("=== Booking Request Debug ===");
        console.log("Listing ID:", id);
        console.log("Check-in:", checkIn);
        console.log("Check-out:", checkOut);
        console.log("User ID:", req.userId);
        
        // Find the listing
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        
        console.log("Listing found - isBooked:", listing.isBooked);
        console.log("Listing guest:", listing.guest);
        
        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        
        if (checkInDate >= checkOutDate) {
            return res.status(400).json({ message: "Invalid check-in/check-out dates" });
        }
        
        if (checkInDate < today) {
            return res.status(400).json({ message: "Check-in date cannot be in the past" });
        }
        
        // Prevent host from booking their own property
        if (listing.host.toString() === req.userId) {
            return res.status(400).json({ 
                message: "You cannot book your own property" 
            });
        }
        
        // Check for existing ACTIVE bookings with date overlap
        const existingBookings = await Booking.find({
            listing: id,
            status: "booked" // Only check active bookings
        });
        
        console.log("Existing active bookings:", existingBookings.length);
        
        for (let booking of existingBookings) {
            console.log("Checking booking:", {
                id: booking._id,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                status: booking.status
            });
            
            // Check for date overlap
            const existingCheckIn = new Date(booking.checkIn);
            const existingCheckOut = new Date(booking.checkOut);
            
            const hasOverlap = (
                (checkInDate < existingCheckOut) && (checkOutDate > existingCheckIn)
            );
            
            if (hasOverlap) {
                console.log("Date overlap detected!");
                return res.status(400).json({ 
                    message: `Listing is already booked from ${existingCheckIn.toDateString()} to ${existingCheckOut.toDateString()}. Please choose different dates.`
                });
            }
        }
        
        console.log("No conflicts found, creating booking...");
        
        // Create the booking
        const booking = await Booking.create({
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalRent,
            host: listing.host,
            guest: req.userId,
            listing: listing._id
        });
        
        await booking.populate("host", "email");
        
        // Update user's booking array
        await User.findByIdAndUpdate(
            req.userId,
            { $push: { booking: booking._id } },
            { new: true }
        );
        
        // Update listing status only if this is the first booking
        listing.guest = req.userId;
        listing.isBooked = true;
        await listing.save();
        
        console.log("Booking created successfully:", booking._id);
        
        return res.status(201).json({
            success: true,
            data: booking,
            message: "Booking created successfully"
        });
        
    } catch (error) {
        console.error("Booking creation error:", error);
        return res.status(500).json({ 
            message: `Booking error: ${error.message}` 
        });
    }
};


export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params; // Listing ID
        
        // Find the active booking for this listing by the current user
        const booking = await Booking.findOne({
            listing: id,
            guest: req.userId, // Only allow user to cancel their own booking
            status: "booked"
        });
        
        if (!booking) {
            return res.status(404).json({ 
                message: "No active booking found for this property" 
            });
        }
        
        // Check if cancellation is allowed (e.g., not within 24 hours of check-in)
        const checkInDate = new Date(booking.checkIn);
        const now = new Date();
        const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (hoursUntilCheckIn <= 24) {
            return res.status(400).json({ 
                message: "Cannot cancel booking within 24 hours of check-in" 
            });
        }
        
        // Update booking status to cancelled
        booking.status = "cancel";
        await booking.save();
        
        // Find and update the listing
        const listing = await Listing.findById(id);
        if (listing) {
            listing.isBooked = false;
            listing.guest = null;
            await listing.save();
        }
        
        // Remove booking from user's booking array
        await User.findByIdAndUpdate(
            req.userId,
            { $pull: { booking: booking._id } },
            { new: true }
        );
        
        return res.status(200).json({
            success: true,
            message: "Your booking has been cancelled successfully"
        });
        
    } catch (error) {
        console.error("Booking cancellation error:", error);
        return res.status(500).json({ 
            message: `Booking cancellation error: ${error.message}` 
        });
    }
};


// Additional helper function to get user's bookings
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            guest: req.userId,
            status: "booked"
        }).populate("listing").populate("host", "email");
        
        return res.status(200).json({
            success: true,
            data: bookings
        });
        
    } catch (error) {
        console.error("Get bookings error:", error);
        return res.status(500).json({ 
            message: `Error fetching bookings: ${error.message}` 
        });
    }
};


const cleanupDatabase = async () => {
    try {
        // Find all listings marked as booked
        const bookedListings = await Listing.find({ isBooked: true });
        
        for (let listing of bookedListings) {
            // Check if there's an active booking for this listing
            const activeBooking = await Booking.findOne({
                listing: listing._id,
                status: "booked"
            });
            
            // If no active booking found, reset the listing
            if (!activeBooking) {
                console.log(`Resetting listing ${listing._id} - no active booking found`);
                listing.isBooked = false;
                listing.guest = null;
                await listing.save();
            }
        }
        
        console.log("Database cleanup completed");
    } catch (error) {
        console.error("Cleanup error:", error);
    }
};