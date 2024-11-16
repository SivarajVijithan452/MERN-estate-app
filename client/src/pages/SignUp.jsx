import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="flex items-center justify-center py-6 px-4 mt-10 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900 tracking-tight">
            Sign Up
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signIn" className="font-medium text-indigo-700 hover:text-indigo-800">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 uppercase"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
