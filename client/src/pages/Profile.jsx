import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus } from 'react-icons/ai'
import { useRef } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserAccocuntStart, deleteUserAccocuntSuccess, deleteUserAccocuntFailure } from '../redux/user/userSlice';  
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  // console.log('Current user:', currentUser);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingText, setDeletingText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    let dots = '';
    let interval;
    
    if (loading || isDeleting) {
      interval = setInterval(() => {
        dots = dots.length >= 3 ? '' : dots + '.';
        if (loading) {
          setLoadingText(`Updating${dots}`);
        }
        if (isDeleting) {
          setDeletingText(`Deleting your account${dots}`);
        }
      }, 500);
    }

    return () => clearInterval(interval);
  }, [loading, isDeleting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(updateUserStart());

    try {
      const res = await axios.put(`/api/user/update/${currentUser.data._id}`, {
        username: formData.username || currentUser.data.username,
        email: formData.email || currentUser.data.email,
        password: formData.password,
      }, {
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(updateUserSuccess(res.data));
        toast.success('Profile updated successfully');
        // Clear password field after successful update
        setFormData({ ...formData, password: '' });
      }
    } catch (error) {
      dispatch(updateUserFailure(error.response?.data?.message || 'Error updating profile'));
      console.error(error);
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    

    dispatch(deleteUserAccocuntStart()); // Start the delete user process

    try {
      // Call the API to delete the user account
      const response = await axios.delete(`/api/user/delete-user/${currentUser.data._id}`, {
        withCredentials: true // Important for handling authentication cookies
      });

      if (response.data.success) {
        dispatch(deleteUserAccocuntSuccess()); // Dispatch success action
        // Clear access token from local storage
        localStorage.removeItem('access_token');
        // Clear cookies (you may need a library like js-cookie for this)
        // document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Clear cookie
        // Navigate to sign-up page
        navigate('/signup');
        toast.success('Successfully deleted your account, please sign up again!');
      }
    } catch (error) {
      dispatch(deleteUserAccocuntFailure(error.response?.data?.message || 'Error deleting account')); // Dispatch failure action
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        setLoadingText('Uploading image');
        
        // Extract public_id from current avatar URL if it exists
        const currentAvatarUrl = currentUser?.avatar;
        if (currentAvatarUrl && currentAvatarUrl.includes('cloudinary')) {
          try {
            // Extract just the filename without extension
            const publicId = currentAvatarUrl
              .split('/')
              .pop()
              .split('.')
              .shift();
            
            // console.log('Attempting to delete image with publicId:', publicId);
            
            // Delete old image
            await axios.post('/api/user/delete-image', { 
              publicId 
            }, {
              withCredentials: true
            });
          } catch (error) {
            console.error('Error deleting old image:', error.response?.data || error.message);
            toast.error('Error deleting old image');
          }
        }

        // Create FormData object to send file to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        // 'estate' is the upload preset configured in Cloudinary settings
        formData.append('upload_preset', 'estate');

        // Upload image to Cloudinary's API
        const cloudinaryRes = await axios.post(
          'https://api.cloudinary.com/v1_1/dcxpvubyl/image/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            // Track upload progress and update the UI
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            },
          }
        );

        // If upload successful, update user profile with new avatar URL
        if (cloudinaryRes.data.secure_url) {
          // Send request to our backend to update user profile
          const response = await axios.put('/api/user/update', {
            avatar: cloudinaryRes.data.secure_url,
          }, {
            withCredentials: true // Important for handling authentication cookies
          });

          // Update Redux store with new user data
          dispatch(updateUserSuccess(response.data));
          toast.success('Profile updated successfully');
        }
        
      } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        toast.error('Error updating profile image');
      } finally {
        setLoading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleShowListings = async () => {
    try {
      setError(""); // Reset error before fetching
      const response = await axios.get(`/api/user/listings/${currentUser.data._id}`, {
        withCredentials: true,
      });
      setListings(response.data.listings); // Set listings data
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch listings.");
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      setError(""); // Reset error before deleting
      const response = await axios.delete(`/api/listing/delete/${listingId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
        toast.success("Listing deleted successfully");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete listing.");
      toast.error(error.response?.data?.message || "Failed to delete listing.");
    }
  }

  return (
    <>
      <div className="flex items-center justify-center py-12 px-4 mt-20 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8 bg-white p-12 rounded-xl shadow-lg">
          <div>
            <h1 className="text-4xl font-semibold text-center text-gray-900 tracking-tight">
              Profile
            </h1>
            <p className="mt-4 text-center text-base font-medium text-gray-600">
              Hi {currentUser.data.username}, Welcome to your profile page! <br />
              Update your profile details below.
            </p>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="relative w-24 mx-auto">
                  <input 
                    type="file" 
                    id="avatar" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                    ref={fileInputRef}
                  />
                  <div className="relative">
                    <img 
                      src={currentUser.data.avatar} 
                      alt={`${currentUser.data.username}'s profile`} 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <div className="text-white text-xs">{uploadProgress}%</div>
                      </div>
                    )}
                  </div>
                  <div 
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => !loading && fileInputRef.current.click()}
                  >
                    <AiOutlinePlus className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-base font-medium text-gray-700">
                    Username
                  </label>
                  <input type="text" id="username" defaultValue={currentUser.data.username} placeholder="Enter Username" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg" onChange={handleChange} />
                </div>

                <div>
                  <label htmlFor="email" className="block text-base font-medium text-gray-700">
                    Email
                  </label>
                  <input type="email" id="email" defaultValue={currentUser.data.email} placeholder="Enter Email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg" onChange={handleChange} />
                </div>

                <div>
                  <label htmlFor="password" className="block text-base font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={formData.password}
                      placeholder="Enter password"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <AiOutlineEye size={20} />
                      ) : (
                        <AiOutlineEyeInvisible size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={loading || isDeleting}
                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                      loading || isDeleting ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-800'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 uppercase`}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                        <span>{loadingText}</span>
                      </div>
                    ) : (
                      'Update'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading || isDeleting}
                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                      loading || isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 uppercase`}
                  >
                    {isDeleting ? (
                      <div className="flex items-center space-x-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                        <span>{deletingText}</span>
                      </div>
                    ) : (
                      'Delete Account'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-300 mx-auto w-11/12" />

        <div className="flex flex-col min-h-screen sm:px-6 lg:px-8 bg-gray-100">
          <div className="max-w-xxl w-full space-y-6 bg-white p-6 rounded-xl shadow-lg">
            <button
              onClick={handleShowListings}
              className="text-green-700 font-semibold py-2 px-4 border border-green-700 rounded-md hover:bg-green-700 hover:text-white transition duration-300"
            >
              Show Listing
            </button>

            {/* Display the total number of results */}
            {listings.length > 0 && (
              <p className="text-gray-700 mt-4 text-lg">
                Total Listings: <span className="font-bold">{listings.length}</span>
              </p>
            )}

            {/* Display error message if there is an error */}
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {/* Display listings */}
            <div className="mt-4 grid gap-6">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <div key={listing._id} className="p-6 border rounded-lg bg-gray-50 shadow-md">
                    <h2 className="text-xl font-bold mb-2">{listing.name}</h2>
                    <p className="text-gray-700 mb-2">{listing.description}</p>
                    <p className="mt-2 text-gray-600">
                      <strong>Address:</strong> {listing.address}
                    </p>
                    <p className="text-gray-600">
                      <strong>Price:</strong> LKR {listing.regularPrice}
                    </p>
                    <p className="text-gray-600">
                      <strong>Discount Price:</strong> LKR {listing.discountPrice}
                    </p>
                    <p className="text-gray-600">
                      <strong>Bedrooms:</strong> {listing.bedrooms}, <strong>Bathrooms:</strong> {listing.bathrooms}
                    </p>
                    <p className="text-gray-600">
                      <strong>Furnished:</strong> {listing.furnished ? "Yes" : "No"}
                    </p>
                    <p className="text-gray-600">
                      <strong>Parking:</strong> {listing.parking ? "Yes" : "No"}
                    </p>
                    <div className="flex space-x-4 mt-4">
                      {listing.imageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Listing ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                    {/* Action buttons */}
                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No listings to display.</p>
              )}
            </div>
          </div>
        </div>


          
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setShowDeleteModal(false)}
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg 
                      className="h-6 w-6 text-red-600" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete your account? This action cannot be undone. 
                        All of your data will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
