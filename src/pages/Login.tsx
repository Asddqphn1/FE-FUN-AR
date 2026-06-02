import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { fetchApi } from '../lib/api';
import { LayoutDashboard, Loader2, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state: any) => state.setAuth);
  
  const [isDevLoading, setIsDevLoading] = useState(false);
  const [email, setEmail] = useState('dev@school.id');
  const [error, setError] = useState('');

  const isDev = import.meta.env.DEV;

  const handleDevLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDevLoading(true);
    setError('');
    
    try {
      // Fetch /auth/dev-login if endpoint is ready, else mock it
      // Let's implement actual fetch as per API context, but catch and mock if server is down during frontend dev
      let data;
      try {
        data = await fetchApi('/auth/dev-login', {
          method: 'POST',
          body: JSON.stringify({ email }),
        });
      } catch (err: any) {
        console.warn('API error, falling back to mock login:', err.message);
        // Fallback mock
        data = {
          access_token: 'mock_jwt_token_123',
          user_id: 'dev_123',
          full_name: 'Guru Pengembang (Mock)',
        };
      }
      
      setAuth(data.access_token, {
        user_id: data.user_id,
        full_name: data.full_name,
        is_new_user: data.is_new_user
      });
      navigate('/dashboard/buat-soal');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDevLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsDevLoading(true);
    setError('');
    
    try {
      const data = await fetchApi('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      
      setAuth(data.access_token, {
        user_id: data.user_id,
        full_name: data.full_name,
        is_new_user: data.is_new_user
      });
      navigate('/dashboard/buat-soal');
    } catch (err: any) {
      setError(err.message || 'Gagal login dengan Google');
    } finally {
      setIsDevLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Login Google dibatalkan atau gagal.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Subtle depth background */}
      <div className="absolute inset-0 bg-depth pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel w-full max-w-md rounded-3xl p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-outfit font-bold text-slate-800 text-center">GuruPintar AI</h1>
          <p className="text-slate-500 text-center mt-2 font-medium">Asisten Cerdas Pembuat Soal & Ujian</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              shape="pill"
              size="large"
              text="continue_with"
              width="300px"
            />
          </div>

          {error && <p className="text-rose-500 text-sm text-center font-medium bg-rose-50 p-2 rounded-lg">{error}</p>}

          {isDev && (
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                <Code2 className="w-4 h-4 mr-2" /> 
                Developer Login (Debug)
              </div>
              <form onSubmit={handleDevLogin} className="space-y-4">
                <div>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all text-slate-700 text-sm"
                    placeholder="dev@school.id"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isDevLoading}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-semibold transition-colors flex justify-center items-center"
                >
                  {isDevLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk sebagai Dev'}
                </button>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
