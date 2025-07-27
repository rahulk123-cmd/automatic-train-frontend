import React, { useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, Package, ShoppingBag, Clock } from 'lucide-react';
import DealCard from '../Shared/DealCard';

const VendorHome = () => {
  const { deals, orders, fetchDeals, fetchOrders } = useData();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchDeals();
    fetchOrders();
  }, []);

  const activeDeals = (deals || []).filter(deal => deal.status === 'active' && deal.is_approved);
  const myOrders = (orders || []).filter(order => order.vendor_id === user?.id);

  const stats = [
    {
      title: language === 'en' ? 'Active Deals' : 'सक्रिय डील्स',
      value: activeDeals.length,
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: language === 'en' ? 'My Orders' : 'मेरे ऑर्डर',
      value: myOrders.length,
      icon: ShoppingBag,
      color: 'bg-green-500'
    },
    {
      title: language === 'en' ? 'Pending' : 'लंबित',
      value: myOrders.filter(o => o.status === 'pending').length,
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard')}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {language === 'en' 
            ? 'Welcome to your vendor dashboard. Manage your orders and join group buying deals.'
            : 'आपके विक्रेता डैशबोर्ड में आपका स्वागत है। अपने ऑर्डर प्रबंधित करें और समूह खरीदारी डील्स में शामिल हों।'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Deals */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {language === 'en' ? 'Hot Deals' : 'हॉट डील्स'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDeals.slice(0, 6).map((deal) => (
            <DealCard key={deal.id} deal={deal} userRole="vendor" />
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {language === 'en' ? 'Recent Orders' : 'हाल के ऑर्डर'}
        </h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Order ID' : 'ऑर्डर ID'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Product' : 'उत्पाद'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Amount' : 'राशि'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'en' ? 'Status' : 'स्थिति'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myOrders.slice(0, 5).map((order) => {
                  const deal = deals.find(d => d.id === order.deal_id);
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {deal?.products?.title || 'Unknown Product'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
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
    </div>
  );
};

export default VendorHome;
