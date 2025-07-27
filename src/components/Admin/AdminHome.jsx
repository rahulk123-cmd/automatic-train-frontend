import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Users, Package, Zap, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

const AdminHome = () => {
  const { products, deals, orders, commission } = useData();
  const { users } = useAuth();
  const { language } = useLanguage();

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const platformRevenue = totalRevenue * (commission / 100);
  const pendingDeals = deals.filter(d => !d.approved && d.status === 'active').length;
  const unverifiedUsers = users.filter(u => !u.verified).length;

  const stats = [
    {
      title: language === 'en' ? 'Total Users' : 'कुल उपयोगकर्ता',
      value: users.length,
      icon: Users,
      color: 'bg-blue-500',
      badge: unverifiedUsers > 0 ? unverifiedUsers : null
    },
    {
      title: language === 'en' ? 'Total Products' : 'कुल उत्पाद',
      value: products.length,
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: language === 'en' ? 'Active Deals' : 'सक्रिय डील्स',
      value: deals.filter(d => d.status === 'active').length,
      icon: Zap,
      color: 'bg-purple-500',
      badge: pendingDeals > 0 ? pendingDeals : null
    },
    {
      title: language === 'en' ? 'Platform Revenue' : 'प्लेटफॉर्म आय',
      value: `₹${platformRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    {
      type: 'deal',
      message: language === 'en' ? 'New deal created for Electronics' : 'इलेक्ट्रॉनिक्स के लिए नई डील बनाई गई',
      time: '2 minutes ago'
    },
    {
      type: 'user',
      message: language === 'en' ? 'New vendor registered' : 'नया विक्रेता पंजीकृत',
      time: '5 minutes ago'
    },
    {
      type: 'order',
      message: language === 'en' ? 'Order #1234 completed' : 'ऑर्डर #1234 पूर्ण',
      time: '10 minutes ago'
    }
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Admin Dashboard' : 'व्यवस्थापक डैशबोर्ड'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {language === 'en' 
            ? 'Monitor and manage the entire marketplace platform.'
            : 'संपूर्ण मार्केटप्लेस प्लेटफॉर्म की निगरानी और प्रबंधन करें।'
          }
        </p>
      </div>

      {/* Alert Cards */}
      {(pendingDeals > 0 || unverifiedUsers > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingDeals > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="text-sm font-medium text-yellow-800">
                  {language === 'en' ? 'Pending Deal Approvals' : 'लंबित डील अनुमोदन'}
                </h3>
              </div>
              <p className="mt-1 text-sm text-yellow-700">
                {pendingDeals} {language === 'en' ? 'deals waiting for approval' : 'डील्स अनुमोदन की प्रतीक्षा में'}
              </p>
            </div>
          )}
          
          {unverifiedUsers > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-sm font-medium text-red-800">
                  {language === 'en' ? 'Unverified Users' : 'असत्यापित उपयोगकर्ता'}
                </h3>
              </div>
              <p className="mt-1 text-sm text-red-700">
                {unverifiedUsers} {language === 'en' ? 'users need verification' : 'उपयोगकर्ताओं को सत्यापन की आवश्यकता'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6 relative">
              {stat.badge && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {stat.badge}
                </div>
              )}
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {language === 'en' ? 'Recent Activity' : 'हाल की गतिविधि'}
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 mr-3 ${
                    activity.type === 'deal' ? 'bg-blue-500' :
                    activity.type === 'user' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {language === 'en' ? 'Platform Settings' : 'प्लेटफॉर्म सेटिंग्स'}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {language === 'en' ? 'Commission Rate' : 'कमीशन दर'}
              </span>
              <span className="text-sm text-gray-600">{commission}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {language === 'en' ? 'Auto-approve deals' : 'ऑटो-अप्रूव डील्स'}
              </span>
              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {language === 'en' ? 'WhatsApp Integration' : 'व्हाट्सऐप एकीकरण'}
              </span>
              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'Revenue Overview' : 'आय अवलोकन'}
          </h2>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {language === 'en' 
                  ? 'Revenue analytics chart would be displayed here'
                  : 'आय विश्लेषण चार्ट यहाँ प्रदर्शित होगा'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
