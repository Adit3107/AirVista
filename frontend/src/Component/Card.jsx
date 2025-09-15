import React, { useContext, useState } from 'react'
import { userDataContext } from '../Context/UserContext'
import { listingDataContext } from '../Context/ListingContext'
import { useNavigate } from 'react-router-dom'
import { FaStar } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { FcCancel } from "react-icons/fc";
import { bookingDataContext } from '../Context/BookingContext';


function Card({ title, landMark, image1, image2, image3, rent, city, id, ratings, isBooked, host, bookedBy }) {
    const navigate = useNavigate()
    const { userData } = useContext(userDataContext)
    const { handleViewCard } = useContext(listingDataContext)
    const [popUp, setPopUp] = useState(false)
    const { cancelBooking } = useContext(bookingDataContext)
    
    // Determine if current user should see booking status
    const shouldShowBookedStatus = () => {
        if (!isBooked || !userData) return false;
        
        // Show booked status only if current user is:
        // 1. The property owner (host)
        // 2. The person who made the booking (bookedBy)
        return userData._id === host || userData._id === bookedBy;
    }
    
    // Determine if current user can cancel booking
    const canCancelBooking = () => {
        if (!isBooked || !userData) return false;
        
        // Only the property owner can cancel bookings
        return userData._id === host;
    }
    
    const handleClick = (e) => {
        console.log("Card clicked! ID:", id);
        console.log("User:", userData);
        console.log("Is booked:", isBooked);
        console.log("Should show booked status:", shouldShowBookedStatus());
        
        if (userData) {
            handleViewCard(id);
        } else {
            navigate("/login");
        }
    }
    
    const handleCancelClick = (e) => {
        e.stopPropagation();
        setPopUp(true);
    }
    
    const handlePopupAction = (action, e) => {
        e.stopPropagation();
        
        if (action === 'cancel') {
            cancelBooking(id);
        }
        setPopUp(false);
    }
    
    return (
        <div className='w-[330px] max-w-[85%] h-[460px] flex items-start justify-start flex-col rounded-lg cursor-pointer relative z-10 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 p-4' 
             onClick={handleClick}>


            {/* Booked Status Badge - Only show for relevant users */}
            {shouldShowBookedStatus() && (
                <div className='text-[#4CAF50] bg-white rounded-lg absolute flex items-center justify-center right-4 top-4 gap-2 p-3 shadow-md z-20 pointer-events-none'>
                    <GiConfirmed className='w-[20px] h-[20px] text-[#4CAF50]' />
                    <span className='text-sm'>
                        {userData._id === host ? 'Your Property - Booked' : 'Your Booking'}
                    </span>
                </div>
            )}
            
            {/* Cancel Booking Button - Only for property owner */}
            {canCancelBooking() && (
                <div className='text-[red] bg-white rounded-lg absolute flex items-center justify-center right-4 top-16 gap-2 p-3 shadow-md z-20 hover:bg-red-50 cursor-pointer' 
                     onClick={handleCancelClick}>
                    <FcCancel className='w-[20px] h-[20px]' />
                    <span className='text-sm'>Cancel</span>
                </div>
            )}


            {/* Cancel Booking Popup */}
            {popUp && (
                <div className='w-[300px] h-[140px] bg-white absolute top-24 left-4 rounded-lg z-30 shadow-xl border border-gray-200 p-4' 
                     onClick={(e) => e.stopPropagation()}>
                    <div className='w-full h-full flex flex-col'>
                        <div className='text-[#2F3E46] text-lg font-semibold mb-3 text-center'>
                            Cancel Booking
                        </div>
                        <div className='text-[#2F3E46] text-sm mb-4 text-center flex-1'>
                            Are you sure you want to cancel this booking?
                        </div>
                        <div className='flex items-center justify-center gap-3'>
                            <button 
                                className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors duration-200' 
                                onClick={(e) => handlePopupAction('cancel', e)}
                            >
                                Yes
                            </button>
                            <button 
                                className='px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#2F3E46] rounded-lg text-sm transition-colors duration-200' 
                                onClick={(e) => handlePopupAction('close', e)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
           
            {/* Image Carousel */}
            <div className='w-full h-[67%] rounded-t-lg overflow-hidden flex pointer-events-none mb-4'>
                <img src={image1} alt="" className='w-[100%] flex-shrink-0 object-cover' />
                <img src={image2} alt="" className='w-[100%] flex-shrink-0 object-cover' />
                <img src={image3} alt="" className='w-[100%] flex-shrink-0 object-cover' />
            </div>
            
            {/* Card Content */}
            <div className='w-full flex-1 flex flex-col gap-2 pointer-events-none px-2'>
                <div className='flex items-center justify-between text-[18px]'>
                    <span className='w-[80%] text-ellipsis overflow-hidden font-semibold text-nowrap text-[#2F3E46]'>
                        In {(landMark || "").toUpperCase()},{(city || "").toUpperCase()}
                    </span>
                    <span className='flex items-center justify-center gap-2'>
                        <FaStar className='text-[#4CAF50]' />
                        <span className='text-[#2F3E46]'>{ratings}</span>
                    </span>
                </div>
                <span className='text-[15px] w-[80%] text-ellipsis overflow-hidden text-nowrap text-gray-600 mb-2'>
                    {title.toUpperCase()}
                </span>
                <div className='flex items-center justify-between'>
                    <span className='text-[16px] font-semibold text-[#4CAF50]'>
                        ₹{rent}/day
                    </span>
                    
                    {/* Status indicator for different user types */}
                    {shouldShowBookedStatus() && (
                        <span className='text-xs text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full'>
                            {userData._id === host ? 'Your Property' : 'Booked by you'}
                        </span>
                    )}
                    
                    {/* Available indicator for other users when property is actually booked but they shouldn't see it */}
                    {isBooked && !shouldShowBookedStatus() && (
                        <span className='text-xs text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full'>
                            Available
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}


export default Card
