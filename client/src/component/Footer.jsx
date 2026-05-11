import React from 'react'

const Footer = () => {
    return (
        <footer style={{
            borderTop: '1px solid #e9e9e7',
            backgroundColor: '#f7f7f5',
            padding: '20px 24px',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#9b9a97',
            }}>
                <span>Designed &amp; Developed by</span>
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
                    onMouseEnter={e => e.target.style.color = '#1a6bc2'}
                    onMouseLeave={e => e.target.style.color = '#2383e2'}
                >
                    Mayank Singh
                </a>
            </div>
        </footer>
    )
}

export default Footer
