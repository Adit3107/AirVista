import React, { useContext, useState, useEffect } from 'react';
import { GiConfirmed } from "react-icons/gi";
import { FaHome } from "react-icons/fa";
import { bookingDataContext } from '../Context/BookingContext';
import { useNavigate } from 'react-router-dom';
import Star from '../Component/Star';
import { userDataContext } from '../Context/UserContext';
import { authDataContext } from '../Context/AuthContext';
import { listingDataContext } from '../Context/ListingContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Booked() {
  const { bookingData } = useContext(bookingDataContext);
  const [star, setStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const { getListing, cardDetails } = useContext(listingDataContext);
  const navigate = useNavigate();

  // Debug log to see booking data structure
  useEffect(() => {
    console.log("Booking data in Booked component:", bookingData);
    console.log("Card details:", cardDetails);
  }, [bookingData, cardDetails]);

  const handleRating = async (id) => {
    if (star === 0) {
      toast.error("Please select a rating before submitting");
      return;
    }

    if (!id) {
      toast.error("Unable to submit rating - listing ID not found");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/listing/ratings/${id}`,
        { ratings: star },
        { withCredentials: true }
      );
      
      await getListing();
      await getCurrentUser();
      
      console.log(result);
      toast.success("Thank you for your rating!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStar = (value) => {
    setStar(value);
    console.log("You rated", value);
  };

  // Show loading state if no booking data
  if (!bookingData) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2F3E46] text-lg mb-4">Loading booking details...</p>
          <button 
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-lg transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#2F3E46] relative">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center gap-8">
        
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium rounded-lg transition-colors duration-200 shadow-lg md:px-6"
        >
          <FaHome className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>

        {/* Booking Confirmation Card */}
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
          
          {/* Success Icon and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <GiConfirmed className="w-16 h-16 md:w-20 md:h-20 text-[#4CAF50]" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#2F3E46]">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mt-2">
              Your reservation has been successfully processed
            </p>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-[#2F3E46]">Booking ID:</span>
              <span className="text-gray-600 text-sm md:text-base font-mono">
                {bookingData._id || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-[#2F3E46]">Owner Contact:</span>
              <span className="text-gray-600 text-sm md:text-base truncate max-w-48">
                {bookingData.host?.email || 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-[#2F3E46]">Total Amount:</span>
              <span className="text-xl font-bold text-[#4CAF50]">
                ₹{bookingData.totalRent?.toLocaleString() || 'N/A'}
              </span>
            </div>

            {/* Additional booking details */}
            {bookingData.checkIn && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium text-[#2F3E46]">Check-in:</span>
                <span className="text-gray-600 text-sm md:text-base">
                  {new Date(bookingData.checkIn).toLocaleDateString()}
                </span>
              </div>
            )}

            {bookingData.checkOut && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-medium text-[#2F3E46]">Check-out:</span>
                <span className="text-gray-600 text-sm md:text-base">
                  {new Date(bookingData.checkOut).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rating Card */}
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
          
          <div className="text-center mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-[#2F3E46] mb-2">
              Rate Your Experience
            </h2>
            <p className="text-gray-600 text-sm">
              Help others by sharing your experience
            </p>
          </div>

          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-[#4CAF50] mb-2">
              {star > 0 ? `${star} out of 5` : 'Select Rating'}
            </div>
            <p className="text-gray-500 text-sm">
              {star > 0 ? 'Thank you for rating!' : 'Tap the stars below'}
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Star onRate={handleStar} />
          </div>

          <div className="text-center">
            <button
              onClick={() => handleRating(bookingData.listing || cardDetails?._id)}
              disabled={isSubmitting || star === 0}
              className="w-full sm:w-auto px-8 py-3 bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 text-base md:text-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                'Submit Rating'
              )}
            </button>
            
            {star === 0 && (
              <p className="text-red-500 text-sm mt-2">
                Please select a rating before submitting
              </p>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="w-full max-w-lg text-center">
          <p className="text-gray-500 text-sm leading-relaxed">
            A confirmation email has been sent to your registered email address. 
            Please contact the owner if you have any questions about your booking.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Booked;
