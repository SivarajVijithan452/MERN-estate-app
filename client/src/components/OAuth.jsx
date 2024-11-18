import { FcGoogle } from 'react-icons/fc'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from './../firebase';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function OAuth() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            setLoading(true);       
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            await new Promise(resolve => setTimeout(resolve, 2000));
            dispatch(signInStart());
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, avatar: result.user.photoURL }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
            toast.success('Signed in successfully');
            setLoading(false);
        } catch (error) {
            console.log('Could not authorize with Google', error);
            toast.error('Could not authorize with Google');
            if (error.code === 'auth/popup-closed-by-user') {
                // console.log('Popup closed by user');
            }
            dispatch(signInFailure(error.message));
            setLoading(false);
        }
    }
    return (
        <button 
            type='button' 
            onClick={handleGoogleClick} 
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 uppercase relative overflow-hidden ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
        >
            <div className={`${loading ? 'absolute left-1/2 -translate-x-1/2' : 'absolute left-4'} bg-white p-1 rounded transition-all duration-300`}>
                <FcGoogle className='text-2xl' />
            </div>
            <span className={`ml-8 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                Continue with Google
            </span>
            
            {/* Google loading bar */}
            {loading && (
                <div className="absolute bottom-0 left-0 h-1 w-full">
                    <div className="google-progress-bar"></div>
                </div>
            )}
        </button>
    );
}