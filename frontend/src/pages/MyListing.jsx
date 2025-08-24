import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { userDataContext } from '../Context/UserContext';
import { authDataContext } from '../Context/AuthContext';
import Card from '../Component/Card';
import axios from 'axios';
import { toast } from 'react-toastify';

function MyListing() {
    const navigate = useNavigate();
    const { userData } = useContext(userDataContext);
    const { serverUrl } = useContext(authDataContext);
    const [myListings, setMyListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userData) {
            fetchUserListings();
        } else {
            navigate("/login"); // redirect if not logged in
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    const fetchUserListings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${serverUrl}/api/listing/my-listings`, {
                withCredentials: true
            });

            if (response.data.success) {
                setMyListings(response.data.data);
            } else {
                setMyListings([]);
            }
        } catch (error) {
            console.error("Error fetching listings:", error);
            toast.error("Failed to load your listings");
            setMyListings([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#2F3E46] text-lg">Loading your listings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F9F9] text-[#2F3E46] relative">
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
                        MY LISTINGS
                    </h1>
                    <p className="text-gray-600">
                        View and manage your properties
                    </p>
                </div>

                {/* Listings Grid */}
                <div className="flex justify-center">
                    {myListings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
                            {myListings.map((listing) => (
                                <div key={listing._id} className="relative">
                                    <Card
                                        title={listing.title}
                                        landMark={listing.landMark}
                                        city={listing.city}
                                        image1={listing.image1}
                                        image2={listing.image2}
                                        image3={listing.image3}
                                        rent={listing.rent}
                                        id={listing._id}
                                        ratings={listing.ratings}
                                        isBooked={listing.isBooked}
                                        host={listing.host}
                                    />

                                    {/* Listing Status Badge */}
                                    <div className="absolute top-2 left-2 z-20">
                                        {listing.isBooked ? (
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                                                Currently Booked
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                                Available
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="mb-6">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl text-gray-400">🏠</span>
                                </div>
                                <h3 className="text-xl font-semibold text-[#2F3E46] mb-2">
                                    No Listings Yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    You haven't added any properties yet. Start listing now!
                                </p>
                                <button
                                    onClick={() => navigate("/listingpage1")}
                                    className="px-6 py-3 bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    List Your Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyListing;
