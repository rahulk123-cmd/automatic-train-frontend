import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import VendorLayout from './VendorLayout';
import VendorHome from './VendorHome';
import ProductBrowser from './ProductBrowser';
import VendorOrders from './VendorOrders';
import VendorProfile from './VendorProfile';

const VendorDashboard = () => {
  return (
    <VendorLayout>
      <Routes>
        <Route path="/" element={<VendorHome />} />
        <Route path="/products" element={<ProductBrowser />} />
        <Route path="/orders" element={<VendorOrders />} />
        <Route path="/profile" element={<VendorProfile />} />
      </Routes>
    </VendorLayout>
  );
};

export default VendorDashboard;
