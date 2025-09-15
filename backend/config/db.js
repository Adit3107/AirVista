// import dotenv from 'dotenv';
// dotenv.config();

import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected")
    } catch (error) {
        console.log("db error")
    }
}
export default connectDb

// // seedListings.js
// import mongoose from 'mongoose';
// import Listing from "../model/listing.model.js";

// const hostIds = [
//   "68c38ca6cd73822aca7362c3",
//   "68c38c79cd73822aca7362c0",
//   "68c38bcdcd73822aca7362bd"
// ];

// const listings = [
//   {
//     title: "Cabin Stay #1",
//     description: "Perfect getaway for nature lovers.",
//     host: hostIds[0],
//     image1: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
//     image2: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
//     image3: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80",
//     rent: 2771,
//     city: "Manali",
//     landMark: "Solang Valley",
//     category: "cabin",
//     ratings: 4.5,
//     isBooked: false
//   },
//   {
//     title: "Villa Stay #2",
//     description: "Perfect for family vacations.",
//     host: hostIds[0],
//     image1: "https://images.unsplash.com/photo-1424746219973-8fe3bd07d8e3?auto=format&fit=crop&w=800&q=80",
//     image2: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=800&q=80",
//     image3: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
//     rent: 8419,
//     city: "Bangalore",
//     landMark: "MG Road",
//     category: "villa",
//     ratings: 4.5,
//     isBooked: false
//   },
//   {
//     title: "Shops Stay #3",
//     description: "Spacious shop in prime location.",
//     host: hostIds[0],
//     image1: "https://images.unsplash.com/photo-1463427765006-9410ef7e1654?auto=format&fit=crop&w=800&q=80",
//     image2: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
//     image3: "https://images.unsplash.com/photo-1472220625704-91caf2e2b6ab?auto=format&fit=crop&w=800&q=80",
//     rent: 3662,
//     city: "Pune",
//     landMark: "Shivaji Nagar",
//     category: "shops",
//     ratings: 4.0,
//     isBooked: false
//   },
//   {
//     title: "Trending Beachfront Villa",
//     description: "Stay in style at this trending coastal property.",
//     host: hostIds[1],
//     image1: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
//     image2: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
//     image3: "https://images.unsplash.com/photo-1560448075-bb4fef1971ec?auto=format&fit=crop&w=800&q=80",
//     rent: 9500,
//     city: "Goa",
//     landMark: "Baga Beach",
//     category: "trending",
//     ratings: 4.8,
//     isBooked: false
//   },
//   {
//     title: "Farm House Serenity",
//     description: "Relax in a peaceful farmhouse surrounded by greenery.",
//     host: hostIds[1],
//     image1: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
//     image2: "https://images.unsplash.com/photo-1475856034135-5f94cf00f80a?auto=format&fit=crop&w=800&q=80",
//     image3: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80",
//     rent: 5500,
//     city: "Lonavala",
//     landMark: "Tiger Point",
//     category: "farmHouse",
//     ratings: 4.6,
//     isBooked: false
//   },
//   {
//     title: "Pool House Paradise",
//     description: "Private pool house with luxury amenities.",
//     host: hostIds[2],
//     image1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
//     image2: "https://images.unsplash.com/photo-1578894381163-9f672c5655a6?auto=format&fit=crop&w=800&q=80",
//     image3: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
//     rent: 11000,
//     city: "Mumbai",
//     landMark: "Juhu Beach",
//     category: "poolHouse",
//     ratings: 4.9,
//     isBooked: false
//   },
//   {
//     title: "City View Room",
//     description: "Affordable and cozy room with city views.",
//     host: hostIds[2],
//     image1: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
//     image2: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
//     image3: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
//     rent: 1500,
//     city: "Delhi",
//     landMark: "Connaught Place",
//     category: "rooms",
//     ratings: 4.2,
//     isBooked: false
//   },
//   {
//     title: "Luxury Flat Downtown",
//     description: "Modern flat with great amenities in city center.",
//     host: hostIds[0],
//     image1: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
//     image2: "https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=800&q=80",
//     image3: "https://images.unsplash.com/photo-1600585154213-7c1de4a47660?auto=format&fit=crop&w=800&q=80",
//     rent: 7800,
//     city: "Hyderabad",
//     landMark: "Charminar",
//     category: "flat",
//     ratings: 4.7,
//     isBooked: false
//   },
//   {
//     title: "Budget PG Stay",
//     description: "PG with shared kitchen and clean rooms.",
//     host: hostIds[1],
//     image1: "https://images.unsplash.com/photo-1582233479369-94a6d29b1c3b?auto=format&fit=crop&w=800&q=80",
//     image2: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
//     image3: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118d?auto=format&fit=crop&w=800&q=80",
//     rent: 4500,
//     city: "Chennai",
//     landMark: "T Nagar",
//     category: "pg",
//     ratings: 4.1,
//     isBooked: false
//   },
//   // Host 0
// {
//   title: "Luxury Pool Villa",
//   description: "Spacious villa with a private pool and modern amenities.",
//   host: hostIds[0],
//   image1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
//   image2: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=800&q=80",
//   image3: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
//   rent: 5500,
//   city: "Goa",
//   landMark: "Baga Beach",
//   category: "poolHouse",
//   ratings: 4.9,
//   isBooked: false
// },
// {
//   title: "Modern PG Accommodation",
//   description: "Affordable PG with Wi-Fi and daily cleaning service.",
//   host: hostIds[0],
//   image1: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=800&q=80",
//   image2: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
//   image3: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
//   rent: 8000,
//   city: "Pune",
//   landMark: "Hinjewadi IT Park",
//   category: "pg",
//   ratings: 4.4,
//   isBooked: false
// },
// {
//   title: "Cozy Single Room",
//   description: "Compact and peaceful room perfect for solo stays.",
//   host: hostIds[0],
//   image1: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80",
//   image2: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
//   image3: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
//   rent: 1200,
//   city: "Mumbai",
//   landMark: "Bandra West",
//   category: "rooms",
//   ratings: 4.1,
//   isBooked: false
// },

// // Host 1
// {
//   title: "Beachfront PoolHouse",
//   description: "Charming poolhouse with direct beach access.",
//   host: hostIds[1],
//   image1: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
//   image2: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
//   image3: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
//   rent: 7000,
//   city: "Goa",
//   landMark: "Candolim Beach",
//   category: "poolHouse",
//   ratings: 4.8,
//   isBooked: false
// },
// {
//   title: "Shared PG Room",
//   description: "Spacious PG with common kitchen and laundry.",
//   host: hostIds[1],
//   image1: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
//   image2: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
//   image3: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
//   rent: 6000,
//   city: "Bangalore",
//   landMark: "Whitefield",
//   category: "pg",
//   ratings: 4.3,
//   isBooked: false
// },
// {
//   title: "Budget City Room",
//   description: "Simple and clean room in city center.",
//   host: hostIds[1],
//   image1: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
//   image2: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
//   image3: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
//   rent: 1800,
//   city: "Delhi",
//   landMark: "Karol Bagh",
//   category: "rooms",
//   ratings: 4.0,
//   isBooked: false
// },

// // Host 2
// {
//   title: "Hillside Pool Retreat",
//   description: "Private hillside villa with infinity pool and scenic views.",
//   host: hostIds[2],
//   image1: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
//   image2: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
//   image3: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
//   rent: 9000,
//   city: "Manali",
//   landMark: "Mall Road",
//   category: "poolHouse",
//   ratings: 4.9,
//   isBooked: false
// },
// {
//   title: "Modern PG for Students",
//   description: "Fully furnished PG with study area and meals included.",
//   host: hostIds[2],
//   image1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
//   image2: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
//   image3: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
//   rent: 7500,
//   city: "Hyderabad",
//   landMark: "Gachibowli",
//   category: "pg",
//   ratings: 4.5,
//   isBooked: false
// },
// {
//   title: "Deluxe City Room",
//   description: "Spacious deluxe room with balcony and city views.",
//   host: hostIds[2],
//   image1: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
//   image2: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
//   image3: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
//   rent: 2500,
//   city: "Kolkata",
//   landMark: "Park Street",
//   category: "rooms",
//   ratings: 4.2,
//   isBooked: false
// }

// ];

// async function seedListings() {
//   await mongoose.connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

//   try {
//     await Listing.deleteMany();
//     await Listing.insertMany(listings);
//     console.log('Listings seeded successfully ✔️');
//   } catch (err) {
//     console.error('Seeding failed:', err);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// seedListings();

// export default seedListings;
