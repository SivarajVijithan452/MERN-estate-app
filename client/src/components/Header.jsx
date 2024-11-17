import { FaSearch } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Header() {
    const [activeLink, setActiveLink] = useState('/');
    const location = useLocation(); // To get the current route

    // This will update the active link when the location changes
    useEffect(() => {
        const knownRoutes = ['/', '/about', '/signIn'];
        const currentPath = location.pathname;
        setActiveLink(knownRoutes.includes(currentPath) ? currentPath : '');
    }, [location]);

    return (
        <header className="bg-slate-200 shadow-md">
            <div className="max-w-screen-2xl flex justify-between items-center mx-auto p-3">
                <h1 className="text-xl font-bold -ml-50">
                    <Link to='/'>
                        <span className="text-slate-500">Real</span>
                        <span className="text-slate-700">Estate</span>
                    </Link>
                </h1>
                <form className="hidden lg:flex bg-slate-100 p-3 rounded-lg items-center">
                    <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-64 lg:w-80 h-7" />
                    <FaSearch className="text-slate-600 cursor-pointer" />
                </form>
                <ul className="flex gap-4">
                    <Link to='/'>
                        <li
                            className={`hidden sm:inline text-slate-800 hover:underline cursor-pointer ${activeLink === '/' ? 'font-semibold underline' : 'font-normal'}`}
                            onClick={() => setActiveLink('/')}
                        >
                            Home
                        </li>
                    </Link>
                    <Link to='/about'>
                        <li
                            className={`hidden sm:inline text-slate-800 hover:underline cursor-pointer ${activeLink === '/about' ? 'font-semibold underline' : 'font-normal'}`}
                            onClick={() => setActiveLink('/about')}
                        >
                            About
                        </li>
                    </Link>
                    <Link to='/signIn'>
                        <li
                            className={`text-slate-800 hover:underline cursor-pointer ${activeLink === '/signIn' ? 'font-semibold underline' : 'font-normal'}`}
                            onClick={() => setActiveLink('/signIn')}
                        >
                            Sign In
                        </li>
                    </Link>
                </ul>
            </div>
        </header>
    )
}
