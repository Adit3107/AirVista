import React, { useContext, useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { listingDataContext } from '../Context/ListingContext';

function ListingPage1() {
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
    category, setCategory
  } = useContext(listingDataContext);

  const handleImage = (e, setBackEnd, setFrontEnd) => {
    const file = e.target.files[0];
    if (file) {
      setBackEnd(file);
      setFrontEnd(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/listingpage2");
        }}
        className="w-full max-w-2xl flex flex-col gap-4 overflow-auto"
      >
        <div
          className="w-10 h-10 bg-primary cursor-pointer absolute top-4 left-4 rounded-full flex items-center justify-center"
          onClick={() => navigate("/")}
        >
          <FaArrowLeftLong className="w-5 h-5 text-white" />
        </div>

        <div className="text-white bg-primary rounded-full px-6 py-2 text-lg font-medium self-end shadow-md">
          Set Up Your Home
        </div>

        <InputField
          label="Title"
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., 2BHK near Central Park"
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-lg font-medium text-text">Description</label>
          <textarea
            id="description"
            className="w-full h-24 border-2 border-gray-400 rounded-lg px-4 py-2 text-base"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {[["Image1", setBackEndImage1, setFrontEndImage1], ["Image2", setBackEndImage2, setFrontEndImage2], ["Image3", setBackEndImage3, setFrontEndImage3]].map(([label, setBackEnd, setFrontEnd], index) => (
          <div key={index} className="flex flex-col gap-2">
            <label htmlFor={`img${index + 1}`} className="text-lg font-medium text-text">{label}</label>
            <input
              type="file"
              id={`img${index + 1}`}
              className="w-full border-2 border-gray-400 rounded-lg px-3 py-2 text-sm"
              required
              onChange={(e) => handleImage(e, setBackEnd, setFrontEnd)}
            />
          </div>
        ))}

        <InputField
          label="Rent"
          id="rent"
          type="number"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          placeholder="Rs. ____/day"
        />

        <InputField
          label="City"
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City, Country"
        />

        <InputField
          label="Landmark"
          id="landmark"
          type="text"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder="Nearby landmarks"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg text-lg font-medium mt-4 hover:bg-green-600 transition"
        >
          Next
        </button>
      </form>
    </div>
  );
}

function InputField({ label, id, type, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-lg font-medium text-text">{label}</label>
      <input
        type={type}
        id={id}
        className="w-full h-10 border-2 border-gray-400 rounded-lg px-4 text-base"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default ListingPage1;
