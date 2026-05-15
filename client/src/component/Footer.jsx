import React from 'react'

const Footer = () => {
    const handleReload = (e) => {
        e.preventDefault()
        window.location.href = '/'
    }

    return (
        <footer style={{
            borderTop: '1px solid #e9e9e7',
            backgroundColor: '#f7f7f5',
            padding: '14px 24px',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: '#9b9a97',
            }}>
                {/* Left — Brand */}
                <a
                    href="/"
                    onClick={handleReload}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        color: '#37352f',
                        fontWeight: 600,
                        fontSize: '14px',
                        transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <div style={{
                        width: '20px', height: '20px', borderRadius: '4px',
                        backgroundColor: '#37352f', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                        <svg width="11" height="11" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    Note-Keeper
                </a>

                {/* Right — Credit */}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#9b9a97' }}>Designed &amp; Developed by</span>
                    <a
                        href="https://mayank-developer.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: '#2383e2',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#1a6bc2'}
                        onMouseLeave={e => e.currentTarget.style.color = '#2383e2'}
                    >
                        Mayank Singh
                    </a>
                </span>
            </div>
        </footer>
    )
}

export default Footer

