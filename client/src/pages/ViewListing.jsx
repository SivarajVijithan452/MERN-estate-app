import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaBed, FaBath, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import ContactLand from '../components/ContactLand';

export default function ViewListing() {
  const { listingId } = useParams(); // Destructure listingId from useParams
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === listing.imageUrls.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [listing]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? listing.imageUrls.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === listing.imageUrls.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    // Fetch the listing data when the component mounts
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listing/get-listing/${listingId}`);
        if (!response.ok) {
          throw new Error('Listing not found');
        }
        const data = await response.json();
        setListing(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  // Handle loading and error states
  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  // Render the listing details if data is available
  if (listing) {
    return (
      <div className="flex items-center justify-center py-12 px-4 mt-20 sm:px-6 lg:px-8">
          <div className="max-w-xxl space-y-8 bg-white p-12 rounded-xl shadow-lg mx-auto">
          {/* Listing Title */}
          <h1 className="text-3xl font-bold mb-4">{listing.name}</h1>
          {/* Image Slider */}
            <div className="relative mb-6">
            <img
            src={listing.imageUrls[currentImageIndex]}
            alt={`Listing Image ${currentImageIndex + 1}`}
            className="w-full h-96 object-cover rounded-lg shadow-lg transition-opacity duration-500 ease-in-out"
            />
            <button
            onClick={handlePrevImage}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2"
            >
            <FaArrowLeft />
            </button>
            <button
            onClick={handleNextImage}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2"
            >
            <FaArrowRight />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black opacity-60 p-2 rounded">
            <p>Image {currentImageIndex + 1} of {listing.imageUrls.length}</p>
            </div>
            </div>
            <p className="text-lg mb-6">{listing.description}</p>

            {/* Price and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-2 bg-red-600 text-white p-3 rounded-lg">
            <FaMapMarkerAlt className="text-white" />
            <p className="text-lg">{listing.address}</p>
            </div>
            <div className="flex items-center space-x-2 bg-green-600 text-white p-3 rounded-lg">
            <FaDollarSign className="text-white" />
            <p className="text-lg font-bold">
              {listing.offer ? listing.discountPrice : listing.regularPrice} LKR
            </p>
            </div>
          </div>

          {/* Bedrooms and Bathrooms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-2 p-3 rounded-lg">
            <FaBed />
            <p className="text-lg">{listing.bedrooms} Bedrooms</p>
            </div>
            <div className="flex items-center space-x-2  p-3 rounded-lg">
            <FaBath />
            <p className="text-lg">{listing.bathrooms} Bathrooms</p>
            </div>
          </div>

          {/* Furnished and Parking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center space-x-2 p-3 rounded-lg">
                  <p className="text-lg">
                    <strong>Furnished:</strong> {listing.furnished ? 'Yes' : 'No'}
                  </p>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg">
                <p className="text-lg">
                  <strong>Parking:</strong> {listing.parking ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          {/* Contact Landlord */}
          {/* Only show the contact button if the user is not the landlord */}
          {currentUser && currentUser.id !== listing.userRef && !contact && (
            <div className="flex justify-center">
              <button onClick={() => {setContact(true)}} className="bg-slate-700 text-white uppercase hover:bg-slate-800 rounded-lg p-3">
              Contact Landlord
              </button>
            </div>
          )}
          {/* Contact is true */}
          {contact && <ContactLand listing={listing}/>}
          </div>
      </div>
    );
  }

  return null;
}
