import React from 'react'

const Footer = () => {
    const handleReload = (e) => {
        e.preventDefault()
        window.location.href = '/'
    }

    return (
        <footer style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: '#1a1a2e',
            padding: '20px 24px',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '14px',
                color: '#9b9a97',
                flexWrap: 'wrap',
            }}>
                <a
                    href="/"
                    onClick={handleReload}
                    style={{
                        color: '#ffffff',
                        fontWeight: 700,
                        textDecoration: 'none',
                        letterSpacing: '0.3px',
                        transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.75'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                >
                    Note-Keeper
                </a>
                <span style={{ color: '#4a4a6a' }}>|</span>
                <span style={{ color: '#7a7a9a' }}>Designed &amp; Developed by</span>
                <a
                    href="https://mayank-developer.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    Mayank Singh
                </a>
            </div>
        </footer>
    )
}

export default Footer
