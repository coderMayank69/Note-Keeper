import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('firebaseToken');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('firebaseToken');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid #e9e9e7',
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Logo */}
                <Link
                    to="/"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#37352f' }}
                >
                    <div style={{
                        width: '28px', height: '28px', borderRadius: '6px',
                        backgroundColor: '#37352f', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '15px', letterSpacing: '-0.01em' }}>Note-Keeper</span>
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Link
                        to="/"
                        style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 500,
                            textDecoration: 'none',
                            color: isActive('/') ? '#37352f' : '#6b7280',
                            backgroundColor: isActive('/') ? '#efefef' : 'transparent',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        Home
                    </Link>
                    {token && (
                        <Link
                            to="/notes"
                            style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                color: isActive('/notes') ? '#37352f' : '#6b7280',
                                backgroundColor: isActive('/notes') ? '#efefef' : 'transparent',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            My Notes
                        </Link>
                    )}
                    {token && (
                        <button
                            onClick={handleLogout}
                            style={{
                                marginLeft: '8px',
                                padding: '5px 12px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: 500,
                                border: '1px solid #e9e9e7',
                                backgroundColor: 'transparent',
                                color: '#37352f',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={e => e.target.style.backgroundColor = '#f7f7f5'}
                            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                        >
                            Sign out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
