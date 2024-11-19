import { FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signOutFailure } from '../redux/user/userSlice';  

export default function Header() {
    const [activeLink, setActiveLink] = useState('/');
    const location = useLocation(); // To get the current route
    const { currentUser } = useSelector(state => state.user);
    // console.log('Current user:', currentUser);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();

    // This will update the active link when the location changes
    useEffect(() => {
        const knownRoutes = ['/', '/about', '/signIn'];
        const currentPath = location.pathname;
        setActiveLink(knownRoutes.includes(currentPath) ? currentPath : '');
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            dispatch(signInStart());
            // Call the sign-out API endpoint
            await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
            localStorage.removeItem('access_token'); // {{ edit_2: Remove token from local storage }}
            dispatch(signInSuccess());
            window.location.href = '/'; // Redirect to home after sign out
            toast.success('Successfully SignOut!!!');
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error('Error when signOut', error);
            dispatch(signOutFailure(error.message));
        }
    };

    return (
        <header className="bg-slate-200 shadow-md fixed top-0 w-full z-50">
            <div className="max-w-screen-2xl flex justify-between items-center mx-auto p-3">
                <h1 className="text-xl font-bold">
                    <Link to='/'>
                        <span className="text-slate-500">Real</span>
                        <span className="text-slate-700">Estate</span>
                    </Link>
                </h1>
                <div className="flex items-center gap-6">
                    <form className="hidden lg:flex bg-slate-100 p-3 rounded-lg items-center">
                        <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-64 lg:w-80 h-7" />
                        <FaSearch className="text-slate-600 cursor-pointer" />
                    </form>
                    <ul className="flex items-center gap-4">
                        <Link to='/'>
                            <li className={`hidden sm:inline text-slate-800 hover:underline cursor-pointer ${activeLink === '/' ? 'font-semibold underline' : 'font-normal'}`}
                                onClick={() => setActiveLink('/')}>
                                Home
                            </li>
                        </Link>
                        <Link to='/about'>
                            <li className={`hidden sm:inline text-slate-800 hover:underline cursor-pointer ${activeLink === '/about' ? 'font-semibold underline' : 'font-normal'}`}
                                onClick={() => setActiveLink('/about')}>
                                About
                            </li>
                        </Link>
                        {currentUser ? (
                            <div className="relative" ref={dropdownRef}>
                                <img 
                                    src={currentUser.data.avatar} 
                                    alt={`${currentUser.data.username}'s profile`}
                                    className="w-7 h-7 rounded-full object-cover ml-4 hover:opacity-90 transition-opacity cursor-pointer"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                                    }}
                                />
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                        <Link to="/profile">
                                            <div className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 flex items-center">
                                                <FaUser className="mr-2" />
                                                Profile
                                            </div>
                                        </Link>
                                        <div onClick={handleSignOut} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer">
                                            <FaSignOutAlt className="mr-2" />
                                            Sign Out
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to='/signIn'>
                                <li className={`text-slate-800 hover:underline cursor-pointer ${activeLink === '/signIn' ? 'font-semibold underline' : 'font-normal'}`}
                                    onClick={() => setActiveLink('/signIn')}>
                                    Sign In
                                </li>
                            </Link>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    )
}
