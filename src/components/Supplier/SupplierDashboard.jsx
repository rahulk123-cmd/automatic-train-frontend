import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SupplierLayout from './SupplierLayout';
import SupplierHome from './SupplierHome';
import SupplierProducts from './SupplierProducts';
import SupplierDeals from './SupplierDeals';
import SupplierOrders from './SupplierOrders';

const SupplierDashboard = () => {
  return (
    <SupplierLayout>
      <Routes>
        <Route path="/" element={<SupplierHome />} />
        <Route path="/products" element={<SupplierProducts />} />
        <Route path="/deals" element={<SupplierDeals />} />
        <Route path="/orders" element={<SupplierOrders />} />
      </Routes>
    </SupplierLayout>
  );
};

export default SupplierDashboard;
