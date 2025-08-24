import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { MdBedroomParent, MdOutlinePool } from "react-icons/md";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { useContext } from 'react';
import { listingDataContext } from '../Context/ListingContext';

function ListingPage2() {
  const navigate = useNavigate();
  const { category, setCategory } = useContext(listingDataContext);

  const categories = [
    { label: "Villa", value: "villa", icon: <GiFamilyHouse className='w-8 h-8 text-deep-forest' /> },
    { label: "Farm House", value: "farmHouse", icon: <FaTreeCity className='w-8 h-8 text-deep-forest' /> },
    { label: "Pool House", value: "poolHouse", icon: <MdOutlinePool className='w-8 h-8 text-deep-forest' /> },
    { label: "Rooms", value: "rooms", icon: <MdBedroomParent className='w-8 h-8 text-deep-forest' /> },
    { label: "Flat", value: "flat", icon: <BiBuildingHouse className='w-8 h-8 text-deep-forest' /> },
    { label: "PG", value: "pg", icon: <IoBedOutline className='w-8 h-8 text-deep-forest' /> },
    { label: "Cabin", value: "cabin", icon: <GiWoodCabin className='w-8 h-8 text-deep-forest' /> },
    { label: "Shops", value: "shops", icon: <SiHomeassistantcommunitystore className='w-8 h-8 text-deep-forest' /> },
  ];

  return (
    <div className='w-full min-h-screen bg-white flex items-center justify-center relative overflow-auto p-4'>
      <button
        className='w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white absolute top-4 left-4 shadow-md'
        onClick={() => navigate("/listingpage1")}
      >
        <FaArrowLeftLong className='w-5 h-5' />
      </button>

      <div className='text-white text-lg bg-primary px-6 py-2 rounded-full absolute top-4 right-4 shadow-md'>
        Set Your Category
      </div>

      <div className='w-full max-w-4xl flex flex-col items-center gap-8 mt-20 mb-24'>
        <h1 className='text-xl md:text-3xl text-deep-forest text-center px-2'>Which of these best describes your place?</h1>

        <div className='w-full flex flex-wrap justify-center gap-4'>
          {categories.map((item) => (
            <div
              key={item.value}
              onClick={() => setCategory(item.value)}
              className={`w-40 h-24 flex flex-col items-center justify-center border-2 rounded-lg cursor-pointer text-sm text-deep-forest hover:border-gray-400 transition-all ${category === item.value ? "border-primary" : "border-gray-300"}`}
            >
              {item.icon}
              <span className='mt-2'>{item.label}</span>
            </div>
          ))}
        </div>

        <button
          className='px-6 py-2 bg-primary text-white text-base md:text-lg rounded-lg shadow-md disabled:opacity-50 fixed bottom-6 right-6 md:right-10'
          onClick={() => navigate("/listingpage3")}
          disabled={!category}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ListingPage2;
