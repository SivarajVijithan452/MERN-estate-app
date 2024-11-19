import { useState } from "react";
import { useSelector } from "react-redux";
import Switch from "@mui/material/Switch";

export default function Listing() {
    const { currentUser } = useSelector((state) => state.user);

    // States to manage the switch values (on or off)
    const [isSelling, setIsSelling] = useState(false);
    const [isRenting, setIsRenting] = useState(false);
    const [hasParking, setHasParking] = useState(false);
    const [isFurnished, setIsFurnished] = useState(false);
    const [hasOffer, setHasOffer] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Handle switch changes
    const handleSwitchChange = (stateSetter) => (event) => {
        stateSetter(event.target.checked);
    };

    // Function to handle file upload
    const handleUpload = async (event) => {
        setIsUploading(true); // Set loading state to true
        // Simulate file upload process (replace with actual upload logic)
        const files = event.target.files;
        // Add your upload logic here
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay
        setIsUploading(false); // Reset loading state after upload
    };

    // Function to handle creating a listing
    const handleCreateListing = () => {
        // Add your listing creation logic here
        console.log("Listing created!"); // Placeholder for actual logic
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
                    <form className="flex flex-col sm:flex-row">
                        <div className="flex flex-col gap-4 flex-1 sm:w-1/2 sm:mx-2">
                            <div>
                                <label htmlFor="name" className="block text-base font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value=""
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
                                    value=""
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
                                    value=""
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
                                    <input type="number" id='bedrooms' min='1' max='10' required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg" />
                                </div>

                                <div className="flex items-center gap-2 flex-1">
                                    <label htmlFor="bathrooms" className="block text-base font-medium text-gray-700">
                                        Baths
                                    </label>
                                    <input type="number" id='bathrooms' min='1' max='10' required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="regularPrice" className="block text-base font-medium text-gray-700">
                                    Regular Price
                                </label>
                                <span className="text-xs">LKR / Month</span>
                                <input type="number" id='regularPrice' min='1' max='10000000000' required className="mt-1 block px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="discountPrice" className="block text-base font-medium text-gray-700">
                                    Discount Price
                                </label>
                                <span className="text-xs">LKR / Month</span>
                                <input type="number" id='discountPrice' min='1' max='10000000000' required className="mt-1 block px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg" />
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
                                    onChange={handleUpload}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm">The first image will be cover. {"max - 6"}</span>
                                    <span className="text-red-800 cursor-pointer">Remove</span>
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
                                    onClick={handleCreateListing}
                                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-slate-500 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 uppercase"
                                >
                                    Create Listing
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
