import { FaSearch } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
    const [activeLink, setActiveLink] = useState('/');
    const location = useLocation(); // To get the current route

    // This will update the active link when the location changes
    useState(() => {
        setActiveLink(location.pathname);
    }, [location]);

    return (
        <header className="bg-slate-200 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to='/'>
                    <h1 className="text-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500">Real</span>
                        <span className="text-slate-700">Estate</span>
                    </h1>
                </Link>
                <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                    <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64 md:w-128 h-7" />
                    <FaSearch className="text-slate-600" />
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
