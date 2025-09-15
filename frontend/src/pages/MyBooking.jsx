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
    const [cancelPopup, setCancelPopup] = useState(null)
    const [cancelling, setCancelling] = useState(false)
    
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
            await cancelBooking(listingId)
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
            <div className="max-w-7xl mx-auto px-4 py-8">
                
                <button
                    onClick={() => navigate("/")}
                    className="fixed top-4 left-4 z-50 w-12 h-12 bg-[#4CAF50] hover:bg-[#45a049] rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                >
                    <FaArrowLeftLong className="w-5 h-5 text-white" />
                </button>

                <div className="text-center mt-16 mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#2F3E46] mb-3">
                        MY BOOKINGS
                    </h1>
                    <p className="text-gray-600 text-lg">
                        View and manage your property bookings
                    </p>
                </div>

                <div className="flex justify-center">
                    {userBookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                            {userBookings.map((booking) => (
                                <div
  key={booking._id}
  className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
>
  {/* Property Image */}
  <div className="relative h-56 w-full overflow-hidden">
    <img
      src={booking.listing.image1}
      alt={booking.listing.title}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
    />

    {/* Status Badge */}
    <span
      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
        booking.status === "booked"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {booking.status === "booked" ? "Active Booking" : "Cancelled"}
    </span>

    {/* Cancel Button */}
    {canCancelBooking(booking) && (
      <button
        onClick={(e) => {
          e.stopPropagation()
          setCancelPopup(booking._id)
        }}
        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-xs rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        Cancel
      </button>
    )}
  </div>

  {/* Card Content */}
  <div className="p-5 space-y-3">
    {/* Title & Location */}
    <div>
      <h2 className="text-lg font-bold text-[#2F3E46] line-clamp-1">
        {booking.listing.title}
      </h2>
      <p className="text-sm text-gray-500">
        {booking.listing.landMark}, {booking.listing.city}
      </p>
    </div>

    {/* Dates */}
    <div className="flex justify-between text-sm text-gray-600">
      <div>
        <p className="text-xs text-gray-400">Check-in</p>
        <p className="font-medium">
          {new Date(booking.checkIn).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
      <div>
        <p className="text-xs text-gray-400">Check-out</p>
        <p className="font-medium">
          {new Date(booking.checkOut).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </div>

    {/* Price & Duration */}
    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
      <p className="text-lg font-bold text-green-600">
        ₹{booking.totalRent?.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500">
        {Math.ceil(
          (new Date(booking.checkOut) - new Date(booking.checkIn)) /
            (1000 * 60 * 60 * 24)
        )}{" "}
        days
      </p>
    </div>

    {/* Warning if can't cancel */}
    {!canCancelBooking(booking) && booking.status === "booked" && (
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-2 text-center">
        <p className="text-xs text-yellow-700 font-medium">
          ⚠️ Cannot cancel - Check-in within 24 hours
        </p>
      </div>
    )}
  </div>
</div>

                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="mb-8">
                                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-5xl text-gray-400">📅</span>
                                </div>
                                <h3 className="text-2xl font-semibold text-[#2F3E46] mb-3">
                                    No Bookings Yet
                                </h3>
                                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                                    You haven't made any bookings yet. Start exploring amazing properties and create unforgettable experiences!
                                </p>
                                <button
                                    onClick={() => navigate("/")}
                                    className="px-8 py-4 bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Explore Properties
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Enhanced Cancellation Popup */}
            {cancelPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 transform transition-all duration-300">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FcCancel className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2F3E46] mb-3">
                                Cancel Booking?
                            </h3>
                            <p className="text-gray-600">
                                Are you sure you want to cancel this booking? This action cannot be undone and may incur cancellation fees.
                            </p>
                        </div>

                        {(() => {
                            const booking = userBookings.find(b => b._id === cancelPopup)
                            return booking ? (
                                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                                    <div className="flex items-center mb-4">
                                        <div className="w-3 h-3 bg-[#4CAF50] rounded-full mr-3"></div>
                                        <h4 className="font-semibold text-[#2F3E46] text-lg">{booking.listing.title}</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <p className="text-gray-500 mb-1">Check-in Date</p>
                                            <p className="font-semibold text-[#2F3E46]">
                                                {new Date(booking.checkIn).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 mb-1">Total Amount</p>
                                            <p className="font-bold text-[#4CAF50] text-lg">₹{booking.totalRent?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        })()}

                        <div className="flex gap-4">
                            <button
                                onClick={() => setCancelPopup(null)}
                                disabled={cancelling}
                                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-semibold"
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
                                className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl transition-colors duration-200 font-semibold"
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
