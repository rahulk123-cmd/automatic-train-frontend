import React, { useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Zap, DollarSign, Users } from 'lucide-react';

const SupplierHome = () => {
  const { products, deals, orders, fetchProducts, fetchDeals, fetchOrders } = useData();
  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    if (user?.id) {
      fetchProducts(user.id);
      fetchDeals(user.id);
      fetchOrders(); // Fetches all orders, will filter below
    }
  }, [user]);

  const myProducts = products.filter(p => p.supplier_id === user?.id);
  const myDeals = deals.filter(d => d.supplier_id === user?.id);
  const myOrders = orders.filter(o => o.deals?.supplier_id === user?.id);

  const totalRevenue = myOrders.reduce((sum, order) => sum + order.total_amount, 0);
  const activeDealsCount = myDeals.filter(d => d.status === 'active' && d.is_approved).length;

  const stats = [
    {
      title: language === 'en' ? 'Total Products' : 'कुल उत्पाद',
      value: myProducts.length,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: language === 'en' ? 'Active Deals' : 'सक्रिय डील्स',
      value: activeDealsCount,
      icon: Zap,
      color: 'bg-green-500'
    },
    {
      title: language === 'en' ? 'Total Orders' : 'कुल ऑर्डर',
      value: myOrders.length,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: language === 'en' ? 'Revenue' : 'आय',
      value: `₹${totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ];

  const recentDeals = myDeals.slice(0, 5);
  const recentOrders = myOrders.slice(0, 5);

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Supplier Dashboard' : 'आपूर्तिकर्ता डैशबोर्ड'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {language === 'en' 
            ? 'Manage your products, deals, and track your business performance.'
            : 'अपने उत्पादों, डील्स को प्रबंधित करें और अपने व्यावसायिक प्रदर्शन को ट्रैक करें।'
          }
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {language === 'en' ? 'Recent Deals' : 'हाल की डील्स'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={deal.products?.image_url}
                      alt={deal.products?.title}
                      className="w-10 h-10 rounded object-cover mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {deal.products?.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {deal.current_count}/{deal.moq} {language === 'en' ? 'units' : 'यूनिट'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {deal.moq > 0 ? ((deal.current_count / deal.moq) * 100).toFixed(0) : 0}%
                    </div>
                    <div className={`text-xs capitalize ${
                      deal.status === 'active' ? 'text-green-600' : 
                      deal.status === 'completed' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {deal.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {language === 'en' ? 'Recent Orders' : 'हाल के ऑर्डर'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {language === 'en' ? 'Order' : 'ऑर्डर'} #{order.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.deals?.products?.title || 'N/A'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.total_amount.toFixed(2)}
                      </div>
                      <div className={`text-xs capitalize ${
                        order.status === 'delivered' ? 'text-green-600' :
                        order.status === 'shipped' ? 'text-blue-600' :
                        order.status === 'confirmed' ? 'text-yellow-600' :
                        'text-gray-500'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierHome;
