import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminHome from './AdminHome';
import AdminUsers from './AdminUsers';
import AdminDeals from './AdminDeals';
import AdminCategories from './AdminCategories';
import AdminOrders from './AdminOrders';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/deals" element={<AdminDeals />} />
        <Route path="/categories" element={<AdminCategories />} />
        <Route path="/orders" element={<AdminOrders />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
