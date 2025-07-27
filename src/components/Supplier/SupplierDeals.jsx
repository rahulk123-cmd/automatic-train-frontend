import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Play, Pause, Clock } from 'lucide-react';
import { format } from 'date-fns';

const SupplierDeals = () => {
  const { deals, products, startDeal, updateDeal, fetchDeals, fetchProducts, loading } = useData();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchDeals(user.id);
      fetchProducts(user.id);
    }
  }, [user]);

  const myDeals = deals.filter(d => d.supplier_id === user?.id);
  const myProducts = products.filter(p => p.supplier_id === user?.id && p.is_verified);

  const handleStartDeal = async (dealData) => {
    await startDeal({
      product_id: dealData.productId,
      supplier_id: user.id,
      moq: dealData.moq,
      end_time: dealData.endTime,
      status: 'active',
      is_approved: false, // Admin must approve
    });
    setIsModalOpen(false);
  };

  const toggleDealStatus = async (deal) => {
    if (deal.status === 'active' || deal.status === 'paused') {
      const newStatus = deal.status === 'active' ? 'paused' : 'active';
      await updateDeal(deal.id, { status: newStatus });
    }
  };

  const getStatusBadge = (deal) => {
    if (!deal.is_approved && deal.status !== 'rejected') return <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending Approval</span>;
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
          disabled={myProducts.length === 0}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          {language === 'en' ? 'Start Deal' : 'डील शुरू करें'}
        </button>
      </div>
      {myProducts.length === 0 && !loading && (
        <div className="text-center py-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">You must have at least one verified product to start a deal.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && myDeals.length === 0 ? (
          <p>Loading deals...</p>
        ) : myDeals.map(deal => {
          const progress = deal.moq > 0 ? (deal.current_count / deal.moq) * 100 : 0;
          return (
            <div key={deal.id} className="bg-white rounded-lg shadow p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{deal.products?.title || 'N/A'}</h3>
                {getStatusBadge(deal)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{deal.current_count}/{deal.moq} ({progress.toFixed(1)}%)</span>
                <span>{deal.participants_count} Participants</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Ends on {format(new Date(deal.end_time), 'PP')}
                </div>
                {deal.is_approved && (deal.status === 'active' || deal.status === 'paused') ? (
                  <button onClick={() => toggleDealStatus(deal)} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                    {deal.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {isModalOpen && (
        <StartDealModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleStartDeal}
          products={myProducts}
          language={language}
          loading={loading}
        />
      )}
    </div>
  );
};

const StartDealModal = ({ isOpen, onClose, onSubmit, products, language, loading }) => {
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
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
              {loading ? 'Starting...' : 'Start Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierDeals;
