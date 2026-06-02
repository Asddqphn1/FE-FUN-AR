import React, { useState } from 'react';
import { useSchoolStore } from '../../store/useSchoolStore';
import { Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '../../lib/api';

interface TokenGateProps {
  children: React.ReactNode;
}

export default function TokenGate({ children }: TokenGateProps) {
  const { isValidated, setToken } = useSchoolStore();
  const [inputVal, setInputVal] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate 6 digits
    if (!/^\d{6}$/.test(inputVal)) {
      setError('Token harus berupa 6 digit angka numerik.');
      return;
    }

    try {
      setIsVerifying(true);
      // Validasi token dengan memanggil endpoint teraman yang bisa kita pakai sebagai cek
      // Jika token salah, backend akan melempar error 400 "Token sekolah tidak valid"
      await fetchApi(`/ujian/nilai?token=${inputVal}`);
      
      setSuccess(true);
      setTimeout(() => {
        setToken(inputVal);
      }, 1500); // show success message shortly before revealing content
    } catch (err: any) {
      // Menangkap error dari backend
      setError(err.message || 'Token tidak terdaftar atau telah kedaluwarsa. Silakan periksa kembali.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isValidated) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-[500px]">
      {/* Blurred background content (mock) */}
      <div className="absolute inset-0 filter blur-md opacity-50 pointer-events-none overflow-hidden p-6 bg-slate-50">
         <div className="w-full h-8 bg-slate-200 rounded mb-4 w-1/3"></div>
         <div className="w-full h-32 bg-slate-200 rounded mb-4"></div>
         <div className="w-full h-32 bg-slate-200 rounded"></div>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel w-full max-w-md rounded-2xl p-8 relative overflow-hidden text-center"
        >
          <div className="mx-auto bg-indigo-50 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-outfit font-bold text-slate-800 mb-2">Verifikasi Akses Sekolah</h2>
          <p className="text-slate-600 mb-6 text-sm">
            Untuk mulai menggunakan fitur ini, silakan masukkan Token Sekolah Anda terlebih dahulu.
          </p>
          
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleVerify}
                className="space-y-4"
              >
                <div>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Contoh: 123456"
                    maxLength={6}
                    disabled={isVerifying}
                    className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-indigo-200'} bg-white text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-4 transition-all disabled:opacity-50`}
                  />
                  {error && (
                    <div className="flex items-center text-rose-500 mt-2 text-sm justify-center text-left">
                      <AlertCircle className="w-4 h-4 mr-1 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isVerifying || inputVal.length !== 6}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    'Verifikasi Token'
                  )}
                </button>
                <p className="text-xs text-slate-500 mt-4">
                  * Hubungi Operator Sekolah Anda untuk mendapatkan token akses yang sah.
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 flex flex-col items-center"
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-800">Token Tervalidasi!</h3>
                <p className="text-sm text-slate-600">Selamat datang di Portal Guru.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
