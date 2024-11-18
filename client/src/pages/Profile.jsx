import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlinePlus } from 'react-icons/ai'
import { useRef } from 'react'

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingText, setDeletingText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

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
    
    try {
      // Your update logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    } catch (error) {
      console.error(error);
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
    try {
      // Your delete account logic here
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      setDeletingText('Please wait, this may take a moment...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Additional waiting message
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle the file upload here
      console.log('File selected:', file);
      // You can add your file upload logic here
    }
  };

  return (
    <>
      <div className="flex items-center justify-center py-12 px-4 mt-10 sm:px-6 lg:px-8">
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
                    accept="image/*"  // This restricts to image files only
                    ref={fileInputRef}
                  />
                  <img 
                    src={currentUser.data.avatar} 
                    alt={`${currentUser.data.username}'s profile`} 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div 
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <AiOutlinePlus className="w-5 h-5 text-gray-600" onClick={() => fileInputRef.current.click()} />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-base font-medium text-gray-700">
                    Username
                  </label>
                  <input type="text" id="username" value="" placeholder="Enter Username" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-base font-medium text-gray-700">
                    Email
                  </label>
                  <input type="email" id="email" value="" placeholder="Enter Email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg" />
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
