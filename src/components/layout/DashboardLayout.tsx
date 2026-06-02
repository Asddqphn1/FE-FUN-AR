import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileSignature, GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSchoolStore } from '../../store/useSchoolStore';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const { token, clearToken } = useSchoolStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearToken();
    navigate('/login');
  };

  const navItems = [
    { name: 'Buat Soal', path: '/dashboard/buat-soal', icon: FileSignature },
    { name: 'Nilai Murid', path: '/dashboard/nilai', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-20 relative">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-outfit font-bold text-lg text-slate-800">GuruPintar AI</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-500">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden z-10 relative shadow-sm"
          >
            <div className="p-4 space-y-1">
               {navItems.map((item) => (
                 <NavLink
                   key={item.path}
                   to={item.path}
                   onClick={() => setMobileMenuOpen(false)}
                   className={({ isActive }: { isActive: boolean }) => 
                     `flex items-center px-4 py-3 rounded-xl transition-colors ${
                       isActive 
                         ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                         : 'text-slate-600 hover:bg-slate-50'
                     }`
                   }
                 >
                   <item.icon className="w-5 h-5 mr-3" />
                   {item.name}
                 </NavLink>
               ))}
               <div className="pt-4 mt-4 border-t border-slate-100">
                 <button 
                   onClick={handleLogout}
                   className="flex w-full items-center px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                 >
                   <LogOut className="w-5 h-5 mr-3" />
                   Keluar
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-indigo-200 shadow-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-outfit font-bold text-xl text-slate-800">GuruPintar</h1>
            <p className="text-xs text-indigo-600 font-semibold tracking-wider">AI ASSISTANT</p>
          </div>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) => 
                `flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/50' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.full_name || 'Guru'}</p>
            {token && (
              <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium bg-emerald-50 w-max px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                Token: {token}
              </p>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-50 relative overflow-x-hidden">
        <main className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
