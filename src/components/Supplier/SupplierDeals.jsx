import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Zap, Play, Pause, Clock } from 'lucide-react';

const SupplierDeals = () => {
  const { deals, setDeals, products, startDeal } = useData();
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Assuming current supplier ID is 2
  const myDeals = deals.filter(d => d.supplierId === 2);
  const myProducts = products.filter(p => p.supplierId === 2 && p.verified);

  const handleStartDeal = (dealData) => {
    startDeal(dealData.productId, dealData.moq, dealData.endTime);
    setIsModalOpen(false);
  };

  const toggleDealStatus = (dealId) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        return { ...d, status: d.status === 'active' ? 'paused' : 'active' };
      }
      return d;
    }));
  };

  const getStatusBadge = (deal) => {
    if (!deal.approved && deal.status !== 'rejected') return <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending Approval</span>;
    switch (deal.status) {
      case 'active': return <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>;
      case 'paused': return <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Paused</span>;
      case 'completed': return <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Completed</span>;
      case 'expired': return <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded-full">Expired</span>;
      case 'rejected': return <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded-full">Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{language === 'en' ? 'My Deals' : 'मेरी डील्स'}</h1>
          <p className="mt-1 text-sm text-gray-600">{language === 'en' ? 'Start and manage your group buying deals.' : 'अपनी समूह खरीदारी डील्स शुरू और प्रबंधित करें।'}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          {language === 'en' ? 'Start Deal' : 'डील शुरू करें'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDeals.map(deal => (
          <div key={deal.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900">{deal.product.title}</h3>
              {getStatusBadge(deal)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${deal.progress}%` }}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{deal.currentCount}/{deal.moq} ({deal.progress.toFixed(1)}%)</span>
              <span>{deal.participants} Participants</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Ends in {Math.max(0, Math.ceil((new Date(deal.endTime) - new Date()) / (1000 * 60 * 60 * 24)))} days
              </div>
              {deal.status === 'active' || deal.status === 'paused' ? (
                <button onClick={() => toggleDealStatus(deal.id)} className="text-gray-500 hover:text-gray-700">
                  {deal.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <StartDealModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleStartDeal}
          products={myProducts}
          language={language}
        />
      )}
    </div>
  );
};

const StartDealModal = ({ isOpen, onClose, onSubmit, products, language }) => {
  const [productId, setProductId] = useState('');
  const [moq, setMoq] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ productId: parseInt(productId), moq: parseInt(moq), endTime: new Date(endTime) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">{language === 'en' ? 'Start a New Deal' : 'नई डील शुरू करें'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{language === 'en' ? 'Product' : 'उत्पाद'}</label>
              <select value={productId} onChange={e => setProductId(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                <option value="">{language === 'en' ? 'Select a product' : 'एक उत्पाद चुनें'}</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{language === 'en' ? 'MOQ' : 'न्यूनतम मात्रा'}</label>
              <input type="number" value={moq} onChange={e => setMoq(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{language === 'en' ? 'End Date' : 'अंतिम तिथि'}</label>
              <input type="date" value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
          </div>
          <div className="p-4 bg-gray-50 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border rounded-md">{language === 'en' ? 'Cancel' : 'रद्द करें'}</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{language === 'en' ? 'Start Deal' : 'डील शुरू करें'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierDeals;
