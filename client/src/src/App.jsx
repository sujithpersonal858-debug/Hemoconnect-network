import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { SearchDonors } from './pages/SearchDonors';
import { EmergencySOS } from './pages/EmergencySOS';
import { HospitalDirectory } from './pages/HospitalDirectory';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DonorDashboard } from './pages/DonorDashboard';
import { SeekerDashboard } from './pages/SeekerDashboard';
import { AdminPortal } from './pages/AdminPortal';
import { Unauthorized } from './pages/Unauthorized';

import './App.css';

function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  // Reset tab to dashboard on page route change
  useEffect(() => {
    setActiveTab('dashboard');
  }, [location.pathname]);

  // Responsive default collapse for smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`scholarfind-app-shell ${isSidebarCollapsed ? 'sidebar-minimized' : 'sidebar-expanded'}`}>
      {/* Persistent Left-Side Dark Navy Navigation Bar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={(tabKey) => setActiveTab(tabKey)}
      />

      {/* Main Content Area that dynamically adjusts width */}
      <div className="scholarfind-main-canvas">
        {/* Minimal Top Header */}
        <TopHeader
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic Route Pages */}
        <main className="scholarfind-page-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchDonors />} />
            <Route path="/emergency-sos" element={<EmergencySOS />} />
            <Route path="/hospitals" element={<HospitalDirectory />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Donor Portal */}
            <Route
              path="/donor-dashboard"
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <DonorDashboard activeTab={activeTab} />
                </ProtectedRoute>
              }
            />

            {/* Protected Seeker Portal */}
            <Route
              path="/seeker-dashboard"
              element={
                <ProtectedRoute allowedRoles={['seeker', 'admin']}>
                  <SeekerDashboard activeTab={activeTab} />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Console */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPortal activeTab={activeTab} />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
