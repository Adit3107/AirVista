import React, { useContext, useEffect, useState } from 'react';
// import logo from '../assets/logo.png';
import { FiSearch } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import the contexts
import { authDataContext } from '../Context/AuthContext';
import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';

// Import the new category data
import { categoryIcons } from '../constant/categoryIcons.js';

function Nav() {
    const [showpopup, setShowpopup] = useState(false);
    const { userData, setUserData } = useContext(userDataContext);
    const navigate = useNavigate();
    const { serverUrl } = useContext(authDataContext);
    const [cate, setCate] = useState(''); // Default to empty string
    const { listingData, setNewListData, searchData, handleSearch, handleViewCard } = useContext(listingDataContext);
    const [input, setInput] = useState("");

    const handleLogOut = async () => {
        try {
            // It's good practice to send credentials with the request
            await axios.post(serverUrl + "/api/auth/logout", {}, { withCredentials: true });
            setUserData(null);
            setShowpopup(false); // Close popup on logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleCategory = (category) => {
        setCate(category);
        if (category === "trending") {
            // When trending is clicked, reset the category filter and show all listings
            setNewListData(listingData);
            setCate(''); // Reset the visual active state
        } else {
            setNewListData(listingData.filter((list) => list.category === category));
        }
    };

    const handleClick = (id) => {
        if (userData) {
            handleViewCard(id);
        } else {
            navigate("/login");
        }
    };

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(input);
        }, 300); // Add a small delay to avoid firing on every keystroke

        return () => clearTimeout(timer); // Cleanup timer
    }, [input, handleSearch]);

    return (
        <div className='fixed top-0 bg-background z-20 w-full'>
            {/* Top Navigation Bar */}
            <div className='w-full min-h-[80px] border-b border-[#dcdcdc] px-5 flex items-center justify-between md:px-10'>
                <div>
                    {/* <img src={logo} alt="logo" className='w-[130px] cursor-pointer' onClick={() => navigate('/')}/> */}
                    <h1 className='text-4xl text-[#4CAF50] font-extrabold'>AirVista</h1>
                </div>

                {/* Desktop Search Bar */}
                <div className='w-[35%] relative hidden md:block'>
                    <input
                        type="text"
                        className='w-full px-6 py-2.5 border-2 border-[#bdbaba] outline-none rounded-full text-base'
                        placeholder='Anywhere | Any Location | Any City'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                    <button className='absolute p-2.5 rounded-full bg-primary right-2 top-1/2 -translate-y-1/2'>
                        <FiSearch className='w-5 h-5 text-white' />
                    </button>
                </div>

                {/* Profile and Listing */}
                <div className='flex items-center justify-center gap-2 relative'>
                    <span
                        className='text-base font-medium cursor-pointer rounded-full hover:bg-gray-100 px-4 py-2 hidden md:block'
                        onClick={() => {
                            if (userData) {
                            navigate("/listingpage1");
                            } else {
                            navigate("/login");
                            }
                        }}
                        >
                        List your home
                        </span>

                    <button className='px-4 py-2 flex items-center justify-center gap-2 border border-[#8d8c8c] rounded-full hover:shadow-lg' onClick={() => setShowpopup(prev => !prev)}>
                        <GiHamburgerMenu className='w-5 h-5' />
                        {userData ? (
                            <span className='w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold'>
                                {userData.name.slice(0, 1).toUpperCase()}
                            </span>
                        ) : (
                            <CgProfile className='w-6 h-6' />
                        )}
                    </button>

                    {/* Profile Dropdown */}
                    {showpopup && (
                        <div className='w-[220px] absolute bg-white shadow-lg top-[120%] right-0 border border-gray-200 z-10 rounded-xl py-2'>
                            <ul className='text-base flex flex-col'>
                                {userData ? (
                                    <li className='w-full px-4 py-2.5 hover:bg-gray-100 cursor-pointer font-semibold' onClick={handleLogOut}>Logout</li>
                                ) : (
                                    <li className='w-full px-4 py-2.5 hover:bg-gray-100 cursor-pointer font-semibold' onClick={() => { navigate("/login"); setShowpopup(false); }}>Login</li>
                                )}
                                <div className='w-full h-[1px] bg-gray-200 my-2'></div>
                                <li className='w-full px-4 py-2.5 hover:bg-gray-100 cursor-pointer' onClick={() => { navigate("/listingpage1"); setShowpopup(false); }}>List your Home</li>
                                <li className='w-full px-4 py-2.5 hover:bg-gray-100 cursor-pointer' onClick={() => { navigate("/mylisting"); setShowpopup(false); }}>My Listings</li>
                                <li className='w-full px-4 py-2.5 hover:bg-gray-100 cursor-pointer' onClick={() => { navigate("/mybooking"); setShowpopup(false); }}>My Bookings</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className='w-full h-[60px] flex items-center justify-center md:hidden px-5'>
                <div className='w-full relative'>
                    <input
                        type="text"
                        className='w-full px-6 py-2.5 border-2 border-[#bdbaba] outline-none rounded-full text-base'
                        placeholder='Anywhere | Any Location...'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                    <button className='absolute p-2.5 rounded-full bg-primary right-2 top-1/2 -translate-y-1/2'>
                        <FiSearch className='w-5 h-5 text-white' />
                    </button>
                </div>
            </div>
            
            {/* Search Results Dropdown */}
            {searchData?.length > 0 && input && (
                 <div className='w-full flex justify-center absolute top-full'>
                    <div className='max-w-lg w-full bg-white shadow-lg rounded-lg border border-gray-200 mt-2 overflow-y-auto max-h-80'>
                        {searchData.map((search) => (
                            <div key={search._id} className='border-b border-gray-200 p-4 hover:bg-gray-100 cursor-pointer' onClick={() => {handleClick(search._id); setInput('');}}>
                                <p className='font-semibold'>{search.title}</p>
                                <p className='text-sm text-gray-600'>{search.landMark}, {search.city}</p>
                            </div>
                        ))}
                    </div>
                 </div>
            )}

            {/* Category Icons Bar */}
            <div className='w-full h-[85px] bg-white flex items-center justify-start cursor-pointer gap-8 overflow-x-auto px-5 md:justify-center'>
                {categoryIcons.map((item) => {
                    const IconComponent = item.icon; // Must be uppercase to be a valid JSX component
                    const isActive = cate === item.category;
                    return (
                        <div
                            key={item.name}
                            className={`flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-text hover:border-b-2 border-gray-300 pb-2 flex-shrink-0 ${isActive ? 'text-black border-b-2 border-black' : ''}`}
                            onClick={() => handleCategory(item.category)}
                        >
                            <IconComponent className='w-6 h-6' />
                            <h3 className='text-xs font-semibold'>{item.name}</h3>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Nav;

