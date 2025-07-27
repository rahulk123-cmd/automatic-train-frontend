import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import VendorDashboard from './components/Vendor/VendorDashboard';
import SupplierDashboard from './components/Supplier/SupplierDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/vendor/*" element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/supplier/*" element={
                  <ProtectedRoute allowedRoles={['supplier']}>
                    <SupplierDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
