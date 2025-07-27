import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Home, Package, ShoppingCart, User, LogOut, Globe, Bell } from 'lucide-react';

const VendorLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/vendor', icon: Home, label: t('dashboard') },
    { path: '/vendor/products', icon: Package, label: t('products') },
    { path: '/vendor/orders', icon: ShoppingCart, label: t('orders') },
    { path: '/vendor/profile', icon: User, label: t('profile') }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'en' ? 'Vendor Panel' : 'विक्रेता पैनल'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={toggleLanguage}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Globe className="w-5 h-5" />
              </button>
              <div className="text-sm text-gray-700">
                {language === 'en' ? 'Welcome' : 'स्वागत'}, {user?.name}
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-10">
          <div className="flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex-1 flex flex-col items-center justify-center py-2 px-3 ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="text-lg font-medium text-gray-900">
                {language === 'en' ? 'Navigation' : 'नेविगेशन'}
              </div>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-0 pb-16 md:pb-0">
          <main className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
