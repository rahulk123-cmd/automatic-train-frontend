import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { TrendingUp, Package, Zap, DollarSign, Users, Clock } from 'lucide-react';

const SupplierHome = () => {
  const { products, deals, orders } = useData();
  const { language } = useLanguage();

  const myProducts = products.filter(p => p.supplierId === 2); // Current supplier
  const myDeals = deals.filter(d => d.supplierId === 2);
  const myOrders = orders.filter(o => {
    const deal = deals.find(d => d.id === o.dealId);
    return deal?.supplierId === 2;
  });

  const totalRevenue = myOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeDeals = myDeals.filter(d => d.status === 'active').length;

  const stats = [
    {
      title: language === 'en' ? 'Total Products' : 'कुल उत्पाद',
      value: myProducts.length,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: language === 'en' ? 'Active Deals' : 'सक्रिय डील्स',
      value: activeDeals,
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

      {/* Stats Grid */}
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
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
                      src={deal.product.image}
                      alt={deal.product.title}
                      className="w-10 h-10 rounded object-cover mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {deal.product.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {deal.currentCount}/{deal.moq} {language === 'en' ? 'units' : 'यूनिट'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {deal.progress.toFixed(0)}%
                    </div>
                    <div className={`text-xs ${
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

        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {language === 'en' ? 'Recent Orders' : 'हाल के ऑर्डर'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const deal = deals.find(d => d.id === order.dealId);
                return (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {language === 'en' ? 'Order' : 'ऑर्डर'} #{order.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {deal?.product?.title}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                      <div className={`text-xs ${
                        order.status === 'delivered' ? 'text-green-600' :
                        order.status === 'shipped' ? 'text-blue-600' :
                        order.status === 'confirmed' ? 'text-yellow-600' :
                        'text-gray-500'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'Sales Analytics' : 'बिक्री विश्लेषण'}
          </h2>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {language === 'en' 
                  ? 'Sales analytics chart would be displayed here'
                  : 'बिक्री विश्लेषण चार्ट यहाँ प्रदर्शित होगा'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierHome;
