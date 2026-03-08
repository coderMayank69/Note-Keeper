
import React from 'react';
import bgImage from '../assets/background.jpg';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('firebaseToken');
  
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      console.log('Firebase ID Token:', token);
      if (!token) {
        console.error('No token received from Firebase!');
        return;
      }
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      console.log('Fetch headers:', headers);
      await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers
      });
      // Store token in localStorage for future API calls
      localStorage.setItem('firebaseToken', token);
      result.user && navigate('/notes');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 w-full h-full min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`
        }}
      >
        
      <div className="absolute inset-0 bg-linear-to-l from-black/80 via-black/50 to-transparent z-10" />
      {/* <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent z-10" /> */}
        <h1 className="text-4xl font-bold mb-6 text-amber-200 drop-shadow-[2px_4px_6px_rgba(0,0,0)] px-6 py-2 rounded z-20">The Note-Keeper</h1>
        <span className=' align-middle text-lg text-gray-100 mb-8 max-w-md text-center drop-shadow-[1px_2px_3px_rgba(0,0,0)] px-4 py-2 rounded z-20'> 
          Your personal note-taking app to keep track of your thoughts, ideas, and important information.Sign in with Google to get started!
        </span>
        {!token ? (
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-lg shadow-orange-500/30 z-20"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.36 13.09 17.74 9.5 24 9.5z" /><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.91-2.18 5.38-4.65 7.04l7.19 5.59C43.98 37.09 46.1 31.27 46.1 24.55z" /><path fill="#FBBC05" d="M10.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.99 15.18 0 19.45 0 24c0 4.55.99 8.82 2.69 12.24l7.98-6.2z" /><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.04 15.53-5.56l-7.19-5.59c-2.01 1.35-4.59 2.15-8.34 2.15-6.26 0-11.64-3.59-13.33-8.74l-7.98 6.2C6.73 42.18 14.82 48 24 48z" /><path fill="none" d="M0 0h48v48H0z" /></g></svg>
            Sign in with Google
          </button>
        ) : (
          <button onClick={() => navigate('/notes')} className="mt-6 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-semibold shadow-lg shadow-orange-500/30 z-20"> 
            Go to Notes
          </button>
        )}
      </div>

    </>
  )
}

export default Home;
