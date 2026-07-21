import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeDirectory from './pages/EmployeeDirectory';
import EmployeeProfile from './pages/EmployeeProfile';
import Departments from './pages/Departments';
import MyProfile from './pages/MyProfile';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Loading PulseHR...</div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-layout">
      {!isLoginPage && (
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      )}

      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            </ProtectedRoute>
          } />

          <Route path="/employees" element={
            <ProtectedRoute>
              <EmployeeDirectory onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            </ProtectedRoute>
          } />

          <Route path="/employees/:id" element={
            <ProtectedRoute>
              <EmployeeProfile onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            </ProtectedRoute>
          } />

          <Route path="/departments" element={
            <ProtectedRoute>
              <Departments onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <MyProfile onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}
