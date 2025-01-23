import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdateListing() {
  const { listingId } = useParams();  // Get listingId from URL
  const { currentUser } = useSelector((state) => state.user);

  // States to manage the form fields and switches
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

  // Set the form values once data is fetched
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

  // Handle switch changes
  const handleSwitchChange = (stateSetter) => (event) => {
    stateSetter(event.target.checked);
  };

  // Function to handle file upload to Cloudinary
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

      setUploadedImageUrls(newUploadedImageUrls);
      toast.success("Images successfully uploaded! Now submit your listings.");
      console.log("new", newUploadedImageUrls); // Log the array of uploaded image URLs
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error uploading images.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (url) => {
    setSelectedImages((prevSelected) => {
      if (prevSelected.includes(url)) {
        return prevSelected.filter((item) => item !== url);
      } else {
        return [...prevSelected, url];
      }
    });
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedImages(uploadedImageUrls);
    } else {
      setSelectedImages([]);
    }
  };

  // Function to handle removing selected images
  const handleRemoveSelectedImages = async () => {
    const imagesToRemove = selectedImages;
    if (imagesToRemove.length === 0) {
      toast.warn("No images selected for removal.");
      return;
    }

    try {
      for (const url of imagesToRemove) {
        const publicId = url.split("/").pop().split(".")[0];
        await axios.post(
          "/api/user/delete-image",
          { publicId },
          { withCredentials: true }
        );
      }

      // Update the state to remove the deleted images from uploadedImageUrls and selectedImages
      setUploadedImageUrls((prevUrls) => {
        const updatedUrls = prevUrls.filter((url) => !imagesToRemove.includes(url));
        return updatedUrls;
      });
      setSelectedImages([]);
      toast.success("Selected images removed successfully.");
    } catch (error) {
      console.error("Error removing images:", error);
      toast.error("Error removing selected images.");
    }
  };

  // Handle form submission for updating the listing
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
      imageUrls: uploadedImageUrls, // Only use the updated URLs
      userRef: currentUser.data._id,
      offer: hasOffer,
    };

    try {
      const response = await axios.put(`/api/listing/update/${listingId}`, listingData);
      toast.success("Listing updated successfully!");
      navigate(`/listing/${response.data.data._id}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Error updating listing.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Update Listing</h1>
      <form onSubmit={handleUpdateListing}>
        {/* Form Fields Here */}
        {/* Similar to the original form fields you've provided */}

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

        {/* Selected Images to Remove */}
        {uploadedImageUrls.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Uploaded Images</h2>
            <div>
              <label className="block">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedImages.length === uploadedImageUrls.length}
                />
                Select All
              </label>
              <div className="flex gap-4">
                {uploadedImageUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(url)}
                      onChange={() => handleCheckboxChange(url)}
                    />
                    <img
                      src={url}
                      alt={`Uploaded ${index}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveSelectedImages}
              className="mt-4 py-2 px-4 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition duration-200"
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
