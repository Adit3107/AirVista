import React, { useContext, useEffect, useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { listingDataContext } from '../Context/ListingContext';
import { userDataContext } from '../Context/UserContext';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { FaStar } from "react-icons/fa";
import { bookingDataContext } from '../Context/BookingContext';
import { toast } from 'react-toastify';

function ViewCard() {
  const navigate = useNavigate();
  const { cardDetails, setCardDetails } = useContext(listingDataContext);
  const { userData } = useContext(userDataContext);
  const [updatePopUp, setUpdatePopUp] = useState(false);
  const [bookingPopUp, setBookingPopUp] = useState(false);
  
  // Form states - Initialize with empty values and update when cardDetails loads
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [backEndImage1, setBackEndImage1] = useState(null);
  const [backEndImage2, setBackEndImage2] = useState(null);
  const [backEndImage3, setBackEndImage3] = useState(null);
  const [rent, setRent] = useState('');
  const [city, setCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [minDate, setMinDate] = useState("");

  const { serverUrl } = useContext(authDataContext);
  const { updating, setUpdating, deleting, setDeleting } = useContext(listingDataContext);
  const {
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    total, setTotal,
    night, setNight,
    handleBooking, booking
  } = useContext(bookingDataContext);

  // Update form states when cardDetails loads
  useEffect(() => {
    if (cardDetails) {
      setTitle(cardDetails.title || '');
      setDescription(cardDetails.description || '');
      setRent(cardDetails.rent || '');
      setCity(cardDetails.city || '');
      setLandmark(cardDetails.landMark || '');
    }
  }, [cardDetails]);

  // Calculate booking details
  useEffect(() => {
    if (checkIn && checkOut && cardDetails?.rent) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      const nights = (outDate - inDate) / (24 * 60 * 60 * 1000);
      setNight(nights);
      
      const airBnbCharge = cardDetails.rent * 0.07;
      const tax = cardDetails.rent * 0.07;

      if (nights > 0) {
        setTotal((cardDetails.rent * nights) + airBnbCharge + tax);
      } else {
        setTotal(0);
      }
    }
  }, [checkIn, checkOut, cardDetails?.rent, setNight, setTotal]);

  // Set minimum date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);

  // Check if cardDetails exists, if not redirect to home
  useEffect(() => {
    if (!cardDetails) {
      console.log("No card details found, redirecting to home");
      navigate('/');
      toast.error("Please select a listing to view");
    }
  }, [cardDetails, navigate]);

  const handleUpdateListing = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      if (backEndImage1) formData.append("image1", backEndImage1);
      if (backEndImage2) formData.append("image2", backEndImage2);
      if (backEndImage3) formData.append("image3", backEndImage3);
      formData.append("description", description);
      formData.append("rent", rent);
      formData.append("city", city);
      formData.append("landMark", landmark);

      const result = await axios.post(
        `${serverUrl}/api/listing/update/${cardDetails._id}`,
        formData,
        { withCredentials: true }
      );
      
      setUpdating(false);
      toast.success("Listing Updated");
      
      // Update the cardDetails with new data
      setCardDetails({...cardDetails, title, description, rent, city, landMark: landmark});
      setUpdatePopUp(false);
      
    } catch (error) {
      setUpdating(false);
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteListing = async () => {
    setDeleting(true);
    try {
      await axios.delete(
        `${serverUrl}/api/listing/delete/${cardDetails._id}`,
        { withCredentials: true }
      );
      setDeleting(false);
      toast.success("Listing Deleted");
      navigate("/");
    } catch (error) {
      console.error(error);
      setDeleting(false);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleImageChange = (setter) => (e) => {
    const file = e.target.files[0];
    setter(file);
  };

  // Show loading state while cardDetails is being fetched
  if (!cardDetails) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2F3E46] text-lg">Loading listing details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#2F3E46]">
      {/* Main Container - Centered with max width */}
      <div className="max-w-7xl mx-auto px-4 py-4 relative">
        
        {/* Back Button - Fixed position on mobile */}
        <button
          onClick={() => navigate("/")}
          className="fixed top-4 left-4 z-50 w-12 h-12 bg-[#4CAF50] hover:bg-[#45a049] rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 md:absolute md:top-0 md:left-0"
        >
          <FaArrowLeftLong className="w-5 h-5 text-white" />
        </button>

        {/* Content Container */}
        <div className="pt-16 md:pt-12">
          
          {/* Location Header - Properly centered */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-[#2F3E46] md:text-2xl lg:text-3xl px-4">
              In {cardDetails.landMark?.toUpperCase() || "UNKNOWN"}, {cardDetails.city?.toUpperCase() || "UNKNOWN"}
            </h1>
          </div>

          {/* Image Gallery - Fixed alignment */}
          <div className="mb-8">
            <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] flex flex-col md:flex-row gap-2 rounded-lg overflow-hidden">
              
              {/* Main Image */}
              <div className="flex-1 md:w-3/5 h-full">
                <img
                  src={cardDetails.image1}
                  alt="Property main view"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Secondary Images - Side by side on mobile, stacked on desktop */}
              <div className="flex md:flex-col md:w-2/5 h-1/3 md:h-full gap-2">
                <div className="flex-1">
                  <img
                    src={cardDetails.image2}
                    alt="Property view 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <img
                    src={cardDetails.image3}
                    alt="Property view 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Details - Better spacing and alignment */}
          <div className="space-y-6 mb-8 px-2">
            
            {/* Title */}
            <div className="text-center md:text-left">
              <h2 className="text-lg font-semibold md:text-xl lg:text-2xl leading-tight">
                {cardDetails.title?.toUpperCase()} {cardDetails.category?.toUpperCase()}, {cardDetails.landMark?.toUpperCase()}
              </h2>
            </div>
            
            {/* Description */}
            <div className="text-center md:text-left">
              <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-4xl mx-auto md:mx-0">
                {cardDetails.description}
              </p>
            </div>
            
            {/* Price */}
            <div className="text-center md:text-left">
              <div className="text-xl font-bold text-[#4CAF50] md:text-2xl">
                ₹{cardDetails.rent}/day
              </div>
            </div>
          </div>

          {/* Action Button - Centered */}
          <div className="flex justify-center mb-12">
            {cardDetails.host === userData?._id ? (
              <button
                onClick={() => setUpdatePopUp(true)}
                className="px-8 py-3 bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium rounded-lg transition-colors duration-200 md:px-12 text-base md:text-lg"
              >
                Edit Listing
              </button>
            ) : (
              <button
                onClick={() => setBookingPopUp(true)}
                className="px-8 py-3 bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium rounded-lg transition-colors duration-200 md:px-12 text-base md:text-lg"
              >
                Reserve
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Keep your existing modal code here - Update and Booking modals */}
      {updatePopUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg z-10">
              <h3 className="text-xl font-semibold text-[#2F3E46]">Update Listing</h3>
              <button
                onClick={() => setUpdatePopUp(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <RxCross2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[#2F3E46] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-base"
                    placeholder="2 BHK house or best title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-[#2F3E46] mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-vertical text-base"
                    required
                  />
                </div>

                {/* Image Upload Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num}>
                      <label htmlFor={`img${num}`} className="block text-sm font-medium text-[#2F3E46] mb-2">
                        Image {num}
                      </label>
                      <input
                        type="file"
                        id={`img${num}`}
                        onChange={handleImageChange(
                          num === 1 ? setBackEndImage1 :
                          num === 2 ? setBackEndImage2 : setBackEndImage3
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#4CAF50] file:text-white file:cursor-pointer hover:file:bg-[#45a049] text-sm"
                        accept="image/*"
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Rent, City, Landmark */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="rent" className="block text-sm font-medium text-[#2F3E46] mb-2">
                      Rent (per day)
                    </label>
                    <input
                      type="number"
                      id="rent"
                      value={rent}
                      onChange={(e) => setRent(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-base"
                      placeholder="1000"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-[#2F3E46] mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-base"
                      placeholder="City, Country"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="landmark" className="block text-sm font-medium text-[#2F3E46] mb-2">
                      Landmark
                    </label>
                    <input
                      type="text"
                      id="landmark"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-base"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={handleUpdateListing}
                    disabled={updating}
                    className="flex-1 px-6 py-3 bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 text-base"
                  >
                    {updating ? "Updating..." : "Update Listing"}
                  </button>
                  <button
                    onClick={handleDeleteListing}
                    disabled={deleting}
                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 text-base"
                  >
                    {deleting ? "Deleting..." : "Delete Listing"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingPopUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setBookingPopUp(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-colors duration-200"
            >
              <RxCross2 className="w-6 h-6 text-gray-600" />
            </button>

            {/* Booking Form */}
            <div className="bg-white rounded-lg p-6 flex-1">
              <h2 className="text-2xl font-semibold text-[#2F3E46] mb-6 border-b border-gray-200 pb-4">
                Confirm & Book
              </h2>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-[#2F3E46] mb-4">Your Trip</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-medium text-[#2F3E46] mb-2">
                        Check-in
                      </label>
                      <input
                        type="date"
                        id="checkIn"
                        min={minDate}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-base"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="checkOut" className="block text-sm font-medium text-[#2F3E46] mb-2">
                        Check-out
                      </label>
                      <input
                        type="date"
                        id="checkOut"
                        min={minDate}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-base"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBooking(cardDetails._id)}
                    disabled={booking}
                    className="w-full mt-6 px-6 py-3 bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 text-base"
                  >
                    {booking ? "Booking..." : "Book Now"}
                  </button>
                </div>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="bg-white rounded-lg p-6 flex-1">
              {/* Property Preview */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex gap-4">
                  <img
                    src={cardDetails.image1}
                    alt="Property"
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#2F3E46] truncate text-sm">
                      {cardDetails.landMark?.toUpperCase()}, {cardDetails.city?.toUpperCase()}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">{cardDetails.title}</p>
                    <p className="text-sm text-gray-600">{cardDetails.category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <FaStar className="w-4 h-4 text-[#4CAF50]" />
                      <span className="text-sm text-gray-600">{cardDetails.ratings}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#2F3E46] mb-4">Price Breakdown</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>₹{cardDetails.rent} × {night || 0} nights</span>
                    <span>₹{(cardDetails.rent * (night || 0)).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{(cardDetails.rent * 0.07).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-gray-200 pb-3">
                    <span>Service Fee</span>
                    <span>₹{(cardDetails.rent * 0.07).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>₹{total?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCard;
