import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'
import { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { listingDataContext } from './ListingContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

export const bookingDataContext = createContext()

function BookingContext({children}) {
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [total, setTotal] = useState(0)
    const [night, setNight] = useState(0)
    const { serverUrl } = useContext(authDataContext)
    const { getCurrentUser } = useContext(userDataContext)
    const { getListing } = useContext(listingDataContext)
    const [bookingData, setBookingData] = useState(null) // Changed from [] to null
    const [booking, setBooking] = useState(false) // Fixed naming consistency
    const navigate = useNavigate()

    const handleBooking = async (id) => {
        setBooking(true)
        
        try {
            console.log("Creating booking with:", { checkIn, checkOut, totalRent: total });
            
            const result = await axios.post(serverUrl + `/api/booking/create/${id}`, {
                checkIn,
                checkOut,
                totalRent: total
            }, { withCredentials: true })
            
            console.log("Booking API response:", result.data);
            
            // Handle different response structures from your backend
            let bookingDataToSet;
            if (result.data.success && result.data.data) {
                // If backend returns { success: true, data: booking }
                bookingDataToSet = result.data.data;
            } else if (result.data._id) {
                // If backend returns booking object directly
                bookingDataToSet = result.data;
            } else {
                throw new Error("Invalid response structure");
            }
            
            setBookingData(bookingDataToSet);
            console.log("Booking data set:", bookingDataToSet);
            
            // Refresh user and listing data
            await getCurrentUser();
            await getListing();
            
            setBooking(false);
            
            // Clear form data
            setCheckIn("");
            setCheckOut("");
            setTotal(0);
            setNight(0);
            
            toast.success("Booking Created Successfully!");
            navigate("/booked");
            
        } catch (error) {
            setBooking(false);
            console.error("Booking error:", error);
            
            // Better error handling
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Booking failed. Please try again.");
            }
            
            setBookingData(null);
        }
    }

    const cancelBooking = async (id) => {
        try {
            const result = await axios.delete(serverUrl + `/api/booking/cancel/${id}`, {
                withCredentials: true
            });
            
            await getCurrentUser();
            await getListing();
            
            console.log(result.data);
            toast.success("Booking Cancelled Successfully");
            
        } catch (error) {
            console.error("Cancel booking error:", error);
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to cancel booking");
            }
        }
    }

    const value = {
        checkIn, setCheckIn,
        checkOut, setCheckOut,
        total, setTotal,
        night, setNight,
        bookingData, setBookingData,
        handleBooking, cancelBooking, 
        booking, setBooking // Fixed naming
    }

    return (
        <div>
            <bookingDataContext.Provider value={value}>
                {children}
            </bookingDataContext.Provider>
        </div>
    )
}

export default BookingContext
