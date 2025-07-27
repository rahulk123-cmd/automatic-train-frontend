import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const VendorProfile = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Profile' : 'प्रोफ़ाइल'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {language === 'en' 
            ? 'Manage your account information and preferences.'
            : 'अपनी खाता जानकारी और प्राथमिकताएं प्रबंधित करें।'
          }
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}
          </h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-medium text-gray-900">{user?.name}</h3>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500 capitalize">{user?.role}</span>
                {user?.verified && (
                  <div className="flex items-center ml-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      {language === 'en' ? 'Verified' : 'सत्यापित'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {language === 'en' ? 'Email' : 'ईमेल'}
                </div>
                <div className="text-sm text-gray-600">{user?.email}</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {language === 'en' ? 'Phone' : 'फ़ोन'}
                </div>
                <div className="text-sm text-gray-600">+91 98765 43210</div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg md:col-span-2">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {language === 'en' ? 'Address' : 'पता'}
                </div>
                <div className="text-sm text-gray-600">
                  123, Business District, Mumbai, Maharashtra 400001
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'Account Statistics' : 'खाता आंकड़े'}
          </h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Total Orders' : 'कुल ऑर्डर'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹45,650</div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Total Spent' : 'कुल खर्च'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Deals Joined' : 'डील्स में शामिल'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'Preferences' : 'प्राथमिकताएं'}
          </h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {language === 'en' ? 'WhatsApp Notifications' : 'व्हाट्सऐप सूचनाएं'}
            </span>
            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {language === 'en' ? 'Email Notifications' : 'ईमेल सूचनाएं'}
            </span>
            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {language === 'en' ? 'Deal Alerts' : 'डील अलर्ट'}
            </span>
            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
