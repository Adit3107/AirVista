import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';


export const listingDataContext = createContext()

function ListingContext({children}) {
    const navigate = useNavigate() 
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [frontEndImage1, setFrontEndImage1] = useState(null)
    const [frontEndImage2, setFrontEndImage2] = useState(null)
    const [frontEndImage3, setFrontEndImage3] = useState(null)
    const [backEndImage1, setBackEndImage1] = useState(null)
    const [backEndImage2, setBackEndImage2] = useState(null)
    const [backEndImage3, setBackEndImage3] = useState(null)
    const [rent, setRent] = useState("")
    const [city, setCity] = useState("")
    const [landmark, setLandmark] = useState("")
    const [category, setCategory] = useState("")
    const [adding, setAdding] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [listingData, setListingData] = useState([])
    const [newListData, setNewListData] = useState([])
    const [cardDetails, setCardDetails] = useState(null)
    const [searchData, setSearchData] = useState([])
    const [loading, setLoading] = useState(false)

    const { serverUrl } = useContext(authDataContext)

    const handleAddListing = async () => {
        setAdding(true)
        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("image1", backEndImage1)
            formData.append("image2", backEndImage2)
            formData.append("image3", backEndImage3)
            formData.append("description", description)
            formData.append("rent", rent)
            formData.append("city", city)
            formData.append("landMark", landmark)
            formData.append("category", category)
        
            const result = await axios.post(serverUrl + "/api/listing/add", formData, {withCredentials: true})
            setAdding(false)
            console.log(result)
            navigate("/")
            toast.success("Listing Added Successfully")
            
            // Reset form
            setTitle("")
            setDescription("")
            setFrontEndImage1(null)
            setFrontEndImage2(null)
            setFrontEndImage3(null)
            setBackEndImage1(null)
            setBackEndImage2(null)
            setBackEndImage3(null)
            setRent("")
            setCity("")
            setLandmark("")
            setCategory("")
            
        } catch (error) {
            setAdding(false)
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to add listing")
        }
    }

    // Improved handleViewCard function
    const handleViewCard = async (id) => {
        console.log("Trying to open card with ID:", id)
        setLoading(true)
        
        try {
            const result = await axios.get(
                serverUrl + `/api/listing/findlistingByid/${id}`, 
                { withCredentials: true }
            )
            
            console.log("Listing data received:", result.data)
            setCardDetails(result.data)
            setLoading(false)
            navigate("/viewcard")
            
        } catch (error) {
            setLoading(false)
            console.log("Error fetching listing by ID:", error)
            toast.error("Failed to load listing details")
            
            // Try to find the listing in local data as fallback
            const localListing = newListData.find(item => item._id === id)
            if (localListing) {
                console.log("Using local listing data as fallback")
                setCardDetails(localListing)
                navigate("/viewcard")
            }
        }
    }

    const handleSearch = async (data) => {
    if (!data || data.trim() === "") {
        setSearchData([]); // clear results when search is empty
        return; // stop here, don't hit the backend
    }

    try {
        const result = await axios.get(
            `${serverUrl}/api/listing/search?query=${encodeURIComponent(data)}`
        );
        setSearchData(result.data);
    } catch (error) {
        setSearchData([]);
        console.log(error);
    }
};


    const getListing = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/listing/get", {withCredentials: true})
            setListingData(result.data)
            setNewListData(result.data)
            console.log("Listings loaded:", result.data)
        } catch (error) {
            console.log("Error loading listings:", error)
            toast.error("Failed to load listings")
        }
    }

    useEffect(() => {
        getListing()
    }, [adding, updating, deleting])

    const value = {
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
        setAdding, adding,
        listingData, setListingData,
        getListing,
        newListData, setNewListData,
        handleViewCard,
        cardDetails, setCardDetails,
        updating, setUpdating,
        deleting, setDeleting,
        handleSearch,
        searchData, setSearchData,
        loading
    }

    return (
        <div>
            <listingDataContext.Provider value={value}>
                {children}
            </listingDataContext.Provider>
        </div>
    )
}

export default ListingContext
