import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    analytics: 'Analytics',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    email: 'Email',
    password: 'Password',
    welcome: 'Welcome',
    groupBuying: 'Group Buying',
    categories: 'Categories',
    suppliers: 'Suppliers',
    progress: 'Progress',
    joinDeal: 'Join Deal',
    moq: 'MOQ',
    price: 'Price',
    stock: 'Stock',
    deals: 'Deals',
    active: 'Active',
    completed: 'Completed',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    verify: 'Verify',
    addProduct: 'Add Product',
    startDeal: 'Start Deal',
    users: 'Users',
    commission: 'Commission',
    settings: 'Settings'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    products: 'उत्पाद',
    orders: 'ऑर्डर',
    analytics: 'विश्लेषण',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    email: 'ईमेल',
    password: 'पासवर्ड',
    welcome: 'स्वागत है',
    groupBuying: 'समूह खरीदारी',
    categories: 'श्रेणियां',
    suppliers: 'आपूर्तिकर्ता',
    progress: 'प्रगति',
    joinDeal: 'डील में शामिल हों',
    moq: 'न्यूनतम मात्रा',
    price: 'कीमत',
    stock: 'स्टॉक',
    deals: 'डील्स',
    active: 'सक्रिय',
    completed: 'पूर्ण',
    pending: 'लंबित',
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    verify: 'सत्यापित करें',
    addProduct: 'उत्पाद जोड़ें',
    startDeal: 'डील शुरू करें',
    users: 'उपयोगकर्ता',
    commission: 'कमीशन',
    settings: 'सेटिंग्स'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => translations[language][key] || key;

  const toggleLanguage = () => {
    setLanguage(lang => lang === 'en' ? 'hi' : 'en');
  };

  const value = {
    language,
    setLanguage,
    t,
    toggleLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
