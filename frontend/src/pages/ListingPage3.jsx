import React, { useContext } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { listingDataContext } from '../Context/ListingContext';

function ListingPage3() {
  const navigate = useNavigate();
  const {
    title, setTitle,
    description, setDescription,
    frontEndImage1, setFrontEndImage1,
    frontEndImage2, setFrontEndImage2,
    frontEndImage3, setFrontEndImage3,
    backEndImage1, setBackEndImage1,
    backEndImage2, setBackEndImage2,
    backEndImage3, setBackEndImage3,
    rent, setRent,
    city, setCity,
    landmark, setLandmark,
    category, setCategory,
    handleAddListing,
    adding, setAdding
  } = useContext(listingDataContext);

  return (
    <div className='w-full min-h-screen bg-white flex flex-col items-center justify-start overflow-auto py-6 px-4 relative'>
      <button
        className='w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white absolute top-4 left-4 shadow-md'
        onClick={() => navigate("/listingpage2")}
      >
        <FaArrowLeftLong className='w-5 h-5' />
      </button>

      <div className='w-full max-w-5xl text-xl md:text-3xl text-deep-forest font-medium text-left mt-16 md:mt-20 mb-4'>
        {`In ${landmark.toUpperCase()}, ${city.toUpperCase()}`}
      </div>

      <div className='w-full max-w-5xl flex flex-col md:flex-row gap-4 mb-6'>
        <div className='w-full md:w-2/3 h-64 md:h-96 overflow-hidden border rounded-lg'>
          <img src={frontEndImage1} alt="Front 1" className='w-full h-full object-cover' />
        </div>
        <div className='w-full md:w-1/3 flex flex-col gap-4'>
          <div className='h-32 md:h-1/2 overflow-hidden border rounded-lg'>
            <img src={frontEndImage2} alt="Front 2" className='w-full h-full object-cover' />
          </div>
          <div className='h-32 md:h-1/2 overflow-hidden border rounded-lg'>
            <img src={frontEndImage3} alt="Front 3" className='w-full h-full object-cover' />
          </div>
        </div>
      </div>

      <div className='w-full max-w-5xl text-lg md:text-2xl text-deep-forest mb-2'>
        {`${title.toUpperCase()} ${category.toUpperCase()}, ${landmark.toUpperCase()}`}
      </div>
      <div className='w-full max-w-5xl text-base md:text-xl text-gray-700 mb-2'>
        {description.toUpperCase()}
      </div>
      <div className='w-full max-w-5xl text-lg md:text-2xl text-deep-forest font-semibold mb-6'>
        {`Rs. ${rent}/day`}
      </div>

      <div className='w-full max-w-5xl flex justify-center md:justify-start'>
        <button
          className='px-6 py-3 bg-primary text-white text-lg rounded-lg shadow-md disabled:opacity-50'
          onClick={handleAddListing}
          disabled={adding}
        >
          {adding ? "Adding..." : "Add Listing"}
        </button>
      </div>
    </div>
  );
}

export default ListingPage3;
