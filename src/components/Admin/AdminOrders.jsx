import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

const AdminOrders = () => {
  const { orders, deals } = useData();
  const { users } = useAuth();
  const { language } = useLanguage();

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{language === 'en' ? 'All Orders' : 'सभी ऑर्डर'}</h1>
        <p className="mt-1 text-sm text-gray-600">{language === 'en' ? 'Monitor all orders across the platform.' : 'प्लेटफॉर्म पर सभी ऑर्डर की निगरानी करें।'}</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const deal = deals.find(d => d.id === order.dealId);
                const vendor = users.find(u => u.id === order.vendorId);
                const supplier = users.find(u => u.id === deal?.supplierId);
                return (
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">#{order.id}</div>
                      <div className="text-sm text-gray-500">{format(new Date(order.createdAt), 'PP')}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{vendor?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{supplier?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{deal?.product?.title || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
