import React, { useContext } from 'react'
import Nav from '../Component/Nav'
import Card from '../Component/Card';
import { listingDataContext } from '../Context/ListingContext';

function Home() {
  const { listingData, setListingData, newListData, handleViewCard } = useContext(listingDataContext)
  
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Nav />
      <div className='w-full flex items-center justify-center gap-6 flex-wrap mt-60 md:mt-44 px-4 pb-8'>
{newListData.map((list) => (
    <Card 
        key={list._id}
        title={list.title} 
        landMark={list.landMark} 
        city={list.city} 
        image1={list.image1} 
        rent={list.rent} 
        id={list._id} 
        ratings={list.ratings} 
        isBooked={list.isBooked} 
        host={list.host}
        bookedBy={list.bookedBy} // Add this line - the user who made the booking
        onCardClick={handleViewCard}
    />
))}
      </div>
    </div> 
  )
}

export default Home
