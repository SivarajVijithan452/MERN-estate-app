import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SignUp() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      
      // Simulate 2 seconds loading time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch("/api/auth/signUp", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        navigate("/signIn");
        setFormData({
          username: "",
          email: "",
          password: "",
        });
      } else {
        toast.error(data.message);
        setFormData({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error("An error occurred while signing up", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 mt-10 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-12 rounded-xl shadow-lg">
        <div>
          <h1 className="text-4xl font-semibold text-center text-gray-900 tracking-tight">
            Sign Up
          </h1>
          <p className="mt-4 text-center text-base font-medium text-gray-600">
            Already have an account?{' '}
            <Link to="/signIn" className="font-medium text-indigo-700 hover:text-indigo-800">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-base font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                placeholder="Enter username"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                placeholder="Enter email"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-lg"
                onChange={handleChange}
              />
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
              loading ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-800'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 uppercase`}
          >
            {loading ? (
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
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
