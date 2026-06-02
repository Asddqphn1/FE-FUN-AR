import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import TokenGate from './components/auth/TokenGate';
import BuatSoal from './pages/BuatSoal';
import NilaiMurid from './pages/NilaiMurid';
import LandingPage from './pages/LandingPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state: any) => state.accessToken);
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="buat-soal" element={
            <TokenGate>
              <BuatSoal />
            </TokenGate>
          } />
          <Route path="nilai" element={
            <TokenGate>
              <NilaiMurid />
            </TokenGate>
          } />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard/buat-soal" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
