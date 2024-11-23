import { useState } from "react";
import { useSelector } from "react-redux";
import Switch from "@mui/material/Switch";
import axios from 'axios';
import { toast } from "react-toastify";

export default function Listing() {
    const { currentUser } = useSelector((state) => state.user);

    // States to manage the switch values (on or off)
    const [isSelling, setIsSelling] = useState(false);
    const [isRenting, setIsRenting] = useState(false);
    const [hasParking, setHasParking] = useState(false);
    const [isFurnished, setIsFurnished] = useState(false);
    const [hasOffer, setHasOffer] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    
    // New states for form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [bedrooms, setBedrooms] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const [regularPrice, setRegularPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');

    // Handle switch changes
    const handleSwitchChange = (stateSetter) => (event) => {
        stateSetter(event.target.checked);
    };

    // Function to handle creating a listing
    const handleCreateListing = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const listingData = {
            name,
            description,
            address,
            bedrooms,
            bathrooms,
            regularPrice,
            discountPrice,
            furnished: isFurnished, // Ensure this is set correctly
            parking: hasParking, // Use the state for parking
            type: isSelling ? 'sell' : (isRenting ? 'rent' : 'other'), // Determine type based on switches
            imageUrls: uploadedImageUrls, // Include uploaded image URLs
            userRef: currentUser.data._id, // Set userRef to the current user's ID
            offer: hasOffer // Include the offer state
        };

        try {
            const response = await axios.post('/api/listing/create', listingData); // Adjust the endpoint as necessary
            toast.success(response.data.message); // Show success message
            
            // Reset all fields after successful creation
            setName('');
            setDescription('');
            setAddress('');
            setBedrooms(1);
            setBathrooms(1);
            setRegularPrice('');
            setDiscountPrice('');
            setIsFurnished(false);
            setHasParking(false);
            setIsSelling(false);
            setIsRenting(false);
            setHasOffer(false);
            setFiles([]); // Clear the files array
            setUploadedImageUrls([]); // Clear the uploaded image URLs
            setSelectedImages([]); // Clear selected images

            // Optionally redirect the user or perform other actions
        } catch (error) {
            console.error('Error creating listing:', error);
            toast.error('Error creating listing. Please try again.');
        }
    };

    // Function to handle file upload to Cloudinary
    const handleUpload = async () => {
        // Validation: Check if files array is empty
        if (files.length === 0) {
            console.error('No files selected for upload.'); // Log an error message
            alert('Please select at least one image to upload.'); // Alert the user
            return; // Exit the function early
        }

        setIsUploading(true); // Set loading state to true
        const newUploadedImageUrls = []; // Array to hold the URLs of uploaded images

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'estate'); // Replace with your Cloudinary upload preset

                const response = await axios.post('https://api.cloudinary.com/v1_1/dcxpvubyl/image/upload', formData); // Replace with your Cloudinary cloud name
                newUploadedImageUrls.push(response.data.secure_url); // Get the secure URL of the uploaded image
            }
            setUploadedImageUrls(newUploadedImageUrls); // Update state with the uploaded image URLs
            toast.success('Images successfully uploaded!, now submit your listings');
            console.log("new", newUploadedImageUrls); // Log the array of uploaded image URLs
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error(error);
        } finally {
            setIsUploading(false); // Reset loading state after upload
        }
    };

    // Function to handle individual checkbox change
    const handleCheckboxChange = (url) => {
        setSelectedImages((prevSelected) => {
            if (prevSelected.includes(url)) {
                return prevSelected.filter((item) => item !== url); // Remove from selected
            } else {
                return [...prevSelected, url]; // Add to selected
            }
        });
    };

    // Function to handle "Select All" checkbox
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedImages(uploadedImageUrls); // Select all images
        } else {
            setSelectedImages([]); // Deselect all images
        }
    };

    // Function to handle removing selected images
    const handleRemoveSelectedImages = async () => {
        const imagesToRemove = selectedImages; // Get the currently selected images
        if (imagesToRemove.length === 0) {
            toast.warn('No images selected for removal.'); // Alert if no images are selected
            return;
        }

        try {
            for (const url of imagesToRemove) {
                const publicId = url.split('/').pop().split('.')[0]; // Extract public ID from URL
                await axios.post('/api/user/delete-image', { publicId }, { withCredentials: true }); // Delete from Cloudinary
            }
            // Update state to remove the deleted images from uploadedImageUrls and selectedImages
            setUploadedImageUrls((prevUrls) => {
                const updatedUrls = prevUrls.filter((url) => !imagesToRemove.includes(url));
                console.log(updatedUrls); // Log the updated array of uploaded image URLs
                return updatedUrls; // Return the updated URLs
            });
            setSelectedImages([]); // Clear selected images
            toast.success('Selected images removed successfully.'); // Success message
        } catch (error) {
            console.error('Error removing images:', error);
            toast.error('Error removing selected images.');
        }
    };

    return (
        <>
            <main className="flex items-center mx-auto justify-center py-12 px-4 p-3 mt-20 sm:px-6 lg:px-8">
                <div className="max-w-7xl w-full space-y-8 bg-white p-12 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-semibold text-center text-gray-900 tracking-tight">Create A Listing</h1>
                    <p className="text-center text-base font-medium text-gray-600">
                        Hi {currentUser.data.username}, Welcome to your Listing page! <br />
                        Start to Create Your Listing Here!!!
                    </p>
                    <form className="flex flex-col sm:flex-row" onSubmit={handleCreateListing}>
                        <div className="flex flex-col gap-4 flex-1 sm:w-1/2 sm:mx-2">
                            <div>
                                <label htmlFor="name" className="block text-base font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} // Update name state
                                    placeholder="Enter Name"
                                    maxLength={62}
                                    minLength={11}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-base font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)} // Update description state
                                    placeholder="Enter Description"
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-base font-medium text-gray-700">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)} // Update address state
                                    placeholder="Enter Address"
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                                    required
                                />
                            </div>

                            <div className="flex gap-6 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-gray-700">Sell</span>
                                    <Switch
                                        checked={isSelling}
                                        onChange={handleSwitchChange(setIsSelling)}
                                        color="primary"
                                        className="ml-4"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-gray-700">Rent</span>
                                    <Switch
                                        checked={isRenting}
                                        onChange={handleSwitchChange(setIsRenting)}
                                        color="primary"
                                        className="ml-4"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-gray-700">Offer</span>
                                    <Switch
                                        checked={hasOffer}
                                        onChange={handleSwitchChange(setHasOffer)}
                                        color="primary"
                                        className="ml-4"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-6 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-gray-700">Parking Slot</span>
                                    <Switch
                                        checked={hasParking}
                                        onChange={handleSwitchChange(setHasParking)}
                                        color="primary"
                                        className="ml-4"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-gray-700">Furnished</span>
                                    <Switch
                                        checked={isFurnished}
                                        onChange={handleSwitchChange(setIsFurnished)}
                                        color="primary"
                                        className="ml-4"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex items-center gap-2 flex-1">
                                    <label htmlFor="bedrooms" className="block text-base font-medium text-gray-700">
                                        Beds
                                    </label>
                                    <input
                                        type="number"
                                        id='bedrooms'
                                        min='1'
                                        max='10'
                                        value={bedrooms}
                                        onChange={(e) => setBedrooms(e.target.value)} // Update bedrooms state
                                        required
                                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                                    />
                                </div>

                                <div className="flex items-center gap-2 flex-1">
                                    <label htmlFor="bathrooms" className="block text-base font-medium text-gray-700">
                                        Baths
                                    </label>
                                    <input
                                        type="number"
                                        id='bathrooms'
                                        min='1'
                                        max='10'
                                        value={bathrooms}
                                        onChange={(e) => setBathrooms(e.target.value)} // Update bathrooms state
                                        required
                                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="regularPrice" className="block text-base font-medium text-gray-700">
                                    Regular Price
                                </label>
                                <span className="text-xs">LKR / Month</span>
                                <input
                                    type="number"
                                    id='regularPrice'
                                    min='1'
                                    max='10000000000'
                                    value={regularPrice}
                                    onChange={(e) => setRegularPrice(e.target.value)} // Update regularPrice state
                                    required
                                    className="mt-1 block px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="discountPrice" className="block text-base font-medium text-gray-700">
                                    Discount Price
                                </label>
                                <span className="text-xs">LKR / Month</span>
                                <input
                                    type="number"
                                    id='discountPrice'
                                    min='1'
                                    max='10000000000'
                                    value={discountPrice}
                                    onChange={(e) => setDiscountPrice(e.target.value)} // Update discountPrice state
                                    required
                                    className="mt-1 block px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 flex-1 sm:w-1/2 sm:mx-2">
                            <div>
                                <label htmlFor="images" className="block text-base font-medium text-gray-700">
                                    Images
                                </label>
                                <input
                                    type="file"
                                    id="images"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        const newFiles = Array.from(e.target.files); // Convert FileList to an array
                                        const updatedFiles = [...files, ...newFiles]; // Combine existing files with new ones

                                        // Check if the total number of files exceeds 6
                                        if (updatedFiles.length > 6) {
                                            // Remove excess files
                                            const excessFiles = updatedFiles.slice(0, 6);
                                            setFiles(excessFiles); // Update state with the first 6 files
                                            toast.warn('Maximum 6 images can be uploaded. Please remove some images and add again.'); // Show toast message
                                        } else {
                                            setFiles(updatedFiles); // Update state with the combined array
                                            console.log(updatedFiles); // Log the updated array of files
                                        }
                                    }}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm">The first image will be cover. {"max - 6"}</span>
                                    <span className="text-red-800 cursor-pointer" onClick={handleRemoveSelectedImages}>Remove</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                                        isUploading ? 'bg-green-500 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 uppercase`}
                                >
                                    {isUploading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 text-white mr-2"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        "Upload"
                                    )}
                                </button>
                                <button
                                    type="submit" // Ensure this button submits the form
                                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-slate-500 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 uppercase"
                                >
                                    Create Listing
                                </button>
                            </div>
                            <div className="mt-4">
                                {uploadedImageUrls.length > 0 && (
                                    <div className="overflow-auto h-100 border border-gray-300 rounded-lg p-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedImages.length === uploadedImageUrls.length} // Check if all are selected
                                                    onChange={handleSelectAll}
                                                    className="mr-2"
                                                />
                                                <label>Select All</label>
                                            </div>
                                            <div className="flex flex-row flex-wrap gap-4">
                                                {uploadedImageUrls.map((url, index) => (
                                                    <div key={index} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedImages.includes(url)} // Check if this image is selected
                                                            onChange={() => handleCheckboxChange(url)}
                                                            className="mr-2"
                                                        />
                                                        <img
                                                            src={url}
                                                            alt={`Uploaded Image ${index + 1}`}
                                                            className="w-40 h-40 object-cover rounded"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
