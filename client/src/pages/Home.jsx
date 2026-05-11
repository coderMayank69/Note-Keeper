import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('firebaseToken');

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      if (!idToken) {
        console.error('No token received from Firebase!');
        return;
      }
      await fetch("/api/auth/google", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      localStorage.setItem('firebaseToken', idToken);
      navigate('/notes');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        {/* Emoji */}
        <div style={{ fontSize: '64px', marginBottom: '32px', lineHeight: 1 }}>📝</div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          border: '1px solid #e9e9e7',
          backgroundColor: '#f7f7f5',
          fontSize: '12px',
          fontWeight: 500,
          color: '#6b7280',
          marginBottom: '24px',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0f7b6c', display: 'inline-block' }}></span>
          Personal Workspace
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)',
          fontWeight: 700,
          color: '#37352f',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: '20px',
          maxWidth: '720px',
        }}>
          Your ideas,<br />
          <span style={{ color: '#2383e2' }}>organized beautifully.</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          maxWidth: '480px',
          lineHeight: 1.6,
          marginBottom: '48px',
          fontWeight: 400,
        }}>
          A clean, distraction-free space to capture your thoughts, ideas, and important information. Inspired by Notion.
        </p>

        {/* CTA */}
        {!token ? (
          <button
            onClick={handleGoogleSignIn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#37352f',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease, transform 0.1s ease',
              boxShadow: '0 2px 8px rgba(55,53,47,0.15)',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1a1915'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#37352f'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.36 13.09 17.74 9.5 24 9.5z" />
                <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.91-2.18 5.38-4.65 7.04l7.19 5.59C43.98 37.09 46.1 31.27 46.1 24.55z" />
                <path fill="#FBBC05" d="M10.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.99 15.18 0 19.45 0 24c0 4.55.99 8.82 2.69 12.24l7.98-6.2z" />
                <path fill="#EA4335" d="M24 48c6.18 0 11.64-2.04 15.53-5.56l-7.19-5.59c-2.01 1.35-4.59 2.15-8.34 2.15-6.26 0-11.64-3.59-13.33-8.74l-7.98 6.2C6.73 42.18 14.82 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </g>
            </svg>
            Continue with Google
          </button>
        ) : (
          <button
            onClick={() => navigate('/notes')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#37352f',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1915'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#37352f'}
          >
            Open My Notes
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Features row */}
        <div style={{
          marginTop: '80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          maxWidth: '720px',
          width: '100%',
        }}>
          {[
            { icon: '🔐', label: 'Google Auth', desc: 'Secure sign-in' },
            { icon: '☁️', label: 'Cloud Sync', desc: 'Access anywhere' },
            { icon: '✏️', label: 'Rich Editing', desc: 'Edit & organize' },
          ].map(feature => (
            <div
              key={feature.label}
              style={{
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #e9e9e7',
                backgroundColor: '#f7f7f5',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feature.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#37352f', marginBottom: '4px' }}>{feature.label}</div>
              <div style={{ fontSize: '13px', color: '#9b9a97' }}>{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
