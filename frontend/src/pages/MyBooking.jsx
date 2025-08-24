import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { FcCancel } from "react-icons/fc";
import { userDataContext } from '../Context/UserContext';
import { authDataContext } from '../Context/AuthContext';
import { bookingDataContext } from '../Context/BookingContext';
import Card from '../Component/Card';
import axios from 'axios';
import { toast } from 'react-toastify';

function MyBooking() {
    const navigate = useNavigate()
    const { userData } = useContext(userDataContext)
    const { serverUrl } = useContext(authDataContext)
    const { cancelBooking } = useContext(bookingDataContext)
    const [userBookings, setUserBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancelPopup, setCancelPopup] = useState(null) // Track which booking to cancel
    const [cancelling, setCancelling] = useState(false)
    
    // Fetch user's bookings when component mounts
    useEffect(() => {
        fetchUserBookings()
    }, [])
    
    const fetchUserBookings = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${serverUrl}/api/booking/my-bookings`, {
                withCredentials: true
            })
            
            console.log("User bookings response:", response.data)
            
            if (response.data.success) {
                setUserBookings(response.data.data)
            } else {
                setUserBookings([])
            }
        } catch (error) {
            console.error("Error fetching bookings:", error)
            toast.error("Failed to load your bookings")
            setUserBookings([])
        } finally {
            setLoading(false)
        }
    }

    const handleCancelBooking = async (listingId, bookingId) => {
        setCancelling(true)
        
        try {
            await cancelBooking(listingId) // Your existing cancelBooking function
            
            // Remove the cancelled booking from local state
            setUserBookings(prev => prev.filter(booking => booking._id !== bookingId))
            
            setCancelPopup(null)
            toast.success("Your booking has been cancelled successfully")
            
        } catch (error) {
            console.error("Error cancelling booking:", error)
            toast.error("Failed to cancel booking")
        } finally {
            setCancelling(false)
        }
    }

    const canCancelBooking = (booking) => {
        const checkInDate = new Date(booking.checkIn)
        const today = new Date()
        const timeDiff = checkInDate.getTime() - today.getTime()
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
        
        // Allow cancellation only if check-in is more than 1 day away
        return daysDiff > 1 && booking.status === 'booked'
    }
    
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#2F3E46] text-lg">Loading your bookings...</p>
                </div>
            </div>
        )
    }
    
    return (
        <div className="min-h-screen bg-[#F9F9F9] text-[#2F3E46] relative">
            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="fixed top-4 left-4 z-50 w-12 h-12 bg-[#4CAF50] hover:bg-[#45a049] rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                >
                    <FaArrowLeftLong className="w-5 h-5 text-white" />
                </button>

                {/* Header */}
                <div className="text-center mt-16 mb-12">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#2F3E46] mb-2">
                        MY BOOKINGS
                    </h1>
                    <p className="text-gray-600">
                        View and manage your property bookings
                    </p>
                </div>

                {/* Bookings Grid */}
                <div className="flex justify-center">
                    {userBookings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
                            {userBookings.map((booking) => (
                                <div key={booking._id} className="relative">
                                    <Card 
                                        title={booking.listing.title} 
                                        landMark={booking.listing.landMark} 
                                        city={booking.listing.city} 
                                        image1={booking.listing.image1} 
                                        image2={booking.listing.image2} 
                                        image3={booking.listing.image3} 
                                        rent={booking.listing.rent} 
                                        id={booking.listing._id} 
                                        ratings={booking.listing.ratings} 
                                        isBooked={true}
                                        host={booking.listing.host}
                                        bookedBy={booking.guest}
                                    />
                                    
                                    {/* Cancel Button - Only for user's bookings */}
                                    {canCancelBooking(booking) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setCancelPopup(booking._id)
                                            }}
                                            className="absolute top-2 right-2 z-20 bg-white hover:bg-red-50 border border-red-300 text-red-600 px-3 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <FcCancel className="w-4 h-4" />
                                            <span className="text-sm font-medium">Cancel</span>
                                        </button>
                                    )}

                                    {/* Booking Status Badge */}
                                    <div className="absolute top-2 left-2 z-20">
                                        {booking.status === 'booked' ? (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                                Active Booking
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                                                Cancelled
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Booking Details Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
                                        <div className="text-white text-sm space-y-1">
                                            <p className="font-medium">
                                                Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                                            </p>
                                            <p className="font-medium">
                                                Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                                            </p>
                                            <p className="font-bold text-[#4CAF50] text-base">
                                                Total: ₹{booking.totalRent?.toLocaleString()}
                                            </p>
                                            {!canCancelBooking(booking) && booking.status === 'booked' && (
                                                <p className="text-yellow-300 text-xs">
                                                    Cannot cancel (check-in within 24 hours)
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="mb-6">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl text-gray-400">📅</span>
                                </div>
                                <h3 className="text-xl font-semibold text-[#2F3E46] mb-2">
                                    No Bookings Yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    You haven't made any bookings yet. Start exploring amazing properties!
                                </p>
                                <button
                                    onClick={() => navigate("/")}
                                    className="px-6 py-3 bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    Explore Properties
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancellation Popup */}
            {cancelPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FcCancel className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#2F3E46] mb-2">
                                Cancel Booking
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Are you sure you want to cancel this booking? This action cannot be undone.
                            </p>
                        </div>

                        {/* Booking Details Summary */}
                        {(() => {
                            const booking = userBookings.find(b => b._id === cancelPopup)
                            return booking ? (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-gray-600 mb-1">Property:</p>
                                    <p className="font-medium text-[#2F3E46] mb-3">{booking.listing.title}</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Check-in:</p>
                                            <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Total Paid:</p>
                                            <p className="font-medium text-[#4CAF50]">₹{booking.totalRent?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        })()}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelPopup(null)}
                                disabled={cancelling}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={() => {
                                    const booking = userBookings.find(b => b._id === cancelPopup)
                                    if (booking) {
                                        handleCancelBooking(booking.listing._id, booking._id)
                                    }
                                }}
                                disabled={cancelling}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 font-medium"
                            >
                                {cancelling ? "Cancelling..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyBooking
