import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateListing() {
  const { listingId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // States for form data, switches, files, and uploaded image URLs
  const [isSelling, setIsSelling] = useState(false);
  const [isRenting, setIsRenting] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [isFurnished, setIsFurnished] = useState(false);
  const [hasOffer, setHasOffer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listingData, setListingData] = useState(null);

  // Form data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [regularPrice, setRegularPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await axios.get(`/api/listing/get/${listingId}`);
        setListingData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.error("Failed to fetch listing data.");
        setIsLoading(false);
      }
    };

    fetchListingData();
  }, [listingId]);

  useEffect(() => {
    if (listingData) {
      setName(listingData.name);
      setDescription(listingData.description);
      setAddress(listingData.address);
      setBedrooms(listingData.bedrooms);
      setBathrooms(listingData.bathrooms);
      setRegularPrice(listingData.regularPrice);
      setDiscountPrice(listingData.discountPrice);
      setIsFurnished(listingData.furnished);
      setHasParking(listingData.parking);
      setIsSelling(listingData.type === "sell");
      setIsRenting(listingData.type === "rent");
      setHasOffer(listingData.offer);
      setUploadedImageUrls(listingData.imageUrls);
    }
  }, [listingData]);

  const handleSwitchChange = (stateSetter) => (event) => {
    stateSetter(event.target.checked);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setIsUploading(true);
    const newUploadedImageUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "estate");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dcxpvubyl/image/upload",
          formData
        );
        newUploadedImageUrls.push(response.data.secure_url);
      }

      setUploadedImageUrls([...uploadedImageUrls, ...newUploadedImageUrls]);
      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error uploading images.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image selection for removal
  const handleCheckboxChange = (url) => {
    setSelectedImages((prevSelected) => {
      if (prevSelected.includes(url)) {
        return prevSelected.filter((item) => item !== url);
      } else {
        return [...prevSelected, url];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedImages(uploadedImageUrls);
    } else {
      setSelectedImages([]);
    }
  };

  // Remove selected images from Cloudinary
  const handleRemoveSelectedImages = async () => {
    const imagesToRemove = selectedImages;
    if (imagesToRemove.length === 0) {
      toast.warn("No images selected for removal.");
      return;
    }

    try {
      for (const url of imagesToRemove) {
        const publicId = url.split("/").pop().split(".")[0]; // Extract public ID from URL
        await axios.post(
          "/api/user/delete-image",
          { publicId },
          { withCredentials: true }
        );
      }

      // Remove deleted images from state
      setUploadedImageUrls((prevUrls) =>
        prevUrls.filter((url) => !imagesToRemove.includes(url))
      );
      setSelectedImages([]);
      toast.success("Selected images removed successfully.");
    } catch (error) {
      console.error("Error removing images:", error);
      toast.error("Error removing selected images.");
    }
  };

  const handleUpdateListing = async (event) => {
    event.preventDefault();

    if (uploadedImageUrls.length === 0) {
      toast.warn("Please upload at least one image.");
      return;
    }

    if (discountPrice >= regularPrice) {
      toast.warn("Discount price must be lower than regular price.");
      return;
    }

    const listingData = {
      name,
      description,
      address,
      bedrooms,
      bathrooms,
      regularPrice,
      discountPrice,
      furnished: isFurnished,
      parking: hasParking,
      type: isSelling ? "sell" : isRenting ? "rent" : "other",
      imageUrls: uploadedImageUrls, // Only updated URLs
      userRef: currentUser.data._id,
      offer: hasOffer,
    };

    try {
      const response = await axios.post(`/api/listing/update/${listingId}`, listingData);
      toast.success("Listing updated successfully!");
      navigate(`/listing/${listingId}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Error updating listing.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 bg-white p-12 rounded-xl shadow-lg mt-20">
      <h1 className="text-2xl font-semibold text-center mb-6">Update Listing</h1>
      <form onSubmit={handleUpdateListing}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Property Type */}
        <div className="mb-4 flex items-center gap-4">
          <label className="text-gray-700 font-medium">Sell:</label>
          <Switch checked={isSelling} onChange={handleSwitchChange(setIsSelling)} />
          <label className="text-gray-700 font-medium">Rent:</label>
          <Switch checked={isRenting} onChange={handleSwitchChange(setIsRenting)} />
          <label className="text-gray-700 font-medium">Offer:</label>
          <Switch checked={hasOffer} onChange={handleSwitchChange(setHasOffer)} />
        </div>

        {/* Additional Features */}
        <div className="mb-4 flex items-center gap-4">
          <label className="text-gray-700 font-medium">Parking Slot:</label>
          <Switch checked={hasParking} onChange={handleSwitchChange(setHasParking)} />
          <label className="text-gray-700 font-medium">Furnished:</label>
          <Switch checked={isFurnished} onChange={handleSwitchChange(setIsFurnished)} />
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="mb-4 flex items-center gap-4">
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium">Beds:</label>
            <input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium">Baths:</label>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {/* Prices */}
        <div className="mb-4 flex items-center gap-4">
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium">Regular Price:</label>
            <input
              type="number"
              value={regularPrice}
              onChange={(e) => setRegularPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-medium">Discount Price:</label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Images:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const newFiles = Array.from(e.target.files);
              setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            }}
            className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition duration-200"
        >
          {isUploading ? "Uploading..." : "Upload Images"}
        </button>

        {/* Remove Images */}
        {uploadedImageUrls.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
            <div className="flex gap-4">
              {uploadedImageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(url)}
                    onChange={() => handleCheckboxChange(url)}
                    className="absolute top-0 right-0 z-10"
                  />
                  <img
                    src={url}
                    alt={`Uploaded Image ${index}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleRemoveSelectedImages}
              className="w-full py-2 mt-4 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition duration-200"
            >
              Remove Selected Images
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 py-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition duration-200"
        >
          Update Listing
        </button>
      </form>
    </div>
  );
}
