import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Check, X, Filter } from 'lucide-react';

const AdminDeals = () => {
  const { deals, approveDeal, rejectDeal } = useData();
  const { language } = useLanguage();
  const [filter, setFilter] = useState('pending');

  const filteredDeals = deals.filter(deal => {
    if (filter === 'pending') return !deal.approved && deal.status !== 'rejected';
    if (filter === 'approved') return deal.approved;
    if (filter === 'rejected') return deal.status === 'rejected';
    return true;
  });

  const getStatusBadge = (deal) => {
    if (!deal.approved && deal.status !== 'rejected') return <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>;
    if (deal.status === 'rejected') return <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded-full">Rejected</span>;
    if (deal.approved) return <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">Approved</span>;
    return null;
  };
  
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{language === 'en' ? 'Deal Management' : 'डील प्रबंधन'}</h1>
        <p className="mt-1 text-sm text-gray-600">{language === 'en' ? 'Approve or reject deals created by suppliers.' : 'आपूर्तिकर्ताओं द्वारा बनाई गई डील्स को स्वीकृत या अस्वीकृत करें।'}</p>
      </div>

      <div className="flex space-x-2 border-b">
        <button onClick={() => setFilter('pending')} className={`px-3 py-2 text-sm font-medium ${filter === 'pending' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Pending</button>
        <button onClick={() => setFilter('approved')} className={`px-3 py-2 text-sm font-medium ${filter === 'approved' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Approved</button>
        <button onClick={() => setFilter('rejected')} className={`px-3 py-2 text-sm font-medium ${filter === 'rejected' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Rejected</button>
        <button onClick={() => setFilter('all')} className={`px-3 py-2 text-sm font-medium ${filter === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>All</button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeals.map((deal) => (
                <tr key={deal.id}>
                  <td className="px-6 py-4 font-medium">{deal.product.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{deal.supplierId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{deal.currentCount}/{deal.moq}</td>
                  <td className="px-6 py-4">{getStatusBadge(deal)}</td>
                  <td className="px-6 py-4 space-x-2">
                    {filter === 'pending' && (
                      <>
                        <button onClick={() => approveDeal(deal.id)} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"><Check className="w-4 h-4" /></button>
                        <button onClick={() => rejectDeal(deal.id)} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"><X className="w-4 h-4" /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDeals;
