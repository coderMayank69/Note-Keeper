import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('firebaseToken');

    const handleLogout = () => {
        localStorage.removeItem('firebaseToken');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="relative z-50 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
            <div className="w-full px-6 lg:px-12 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Note-Keeper
                </Link>
                <div className="flex gap-6 items-center">
                    <Link 
                        to="/" 
                        className={`font-medium transition-all hover:text-amber-100 ${isActive('/') ? 'text-white border-b-2 border-white pb-1' : 'text-white/80'}`}
                    >
                        Home
                    </Link>
                    {token && (
                        <Link 
                            to="/notes" 
                            className={`font-medium transition-all hover:text-amber-100 ${isActive('/notes') ? 'text-white border-b-2 border-white pb-1' : 'text-white/80'}`}
                        >
                            Notes
                        </Link>
                    )}
                    {token && (
                        <button
                            onClick={handleLogout}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-all font-medium"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
