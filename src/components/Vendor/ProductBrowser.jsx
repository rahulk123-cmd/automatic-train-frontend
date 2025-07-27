import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Filter } from 'lucide-react';
import DealCard from '../Shared/DealCard';

const ProductBrowser = () => {
  const { products, deals, categories } = useData();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [view, setView] = useState('deals'); // 'deals' or 'products'

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || deal.product.categoryId === parseInt(selectedCategory);
    const isActive = deal.status === 'active' && deal.approved;
    return matchesSearch && matchesCategory && isActive;
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === parseInt(selectedCategory);
    return matchesSearch && matchesCategory && product.verified;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'Browse Products' : 'उत्पाद ब्राउज़ करें'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {language === 'en' 
            ? 'Discover products and join group buying deals for better prices.'
            : 'उत्पादों की खोज करें और बेहतर कीमतों के लिए समूह खरीदारी डील्स में शामिल हों।'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search products...' : 'उत्पाद खोजें...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                {language === 'en' ? 'All Categories' : 'सभी श्रेणियां'}
              </option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {language === 'en' ? category.name : category.nameHi} {category.icon}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setView('deals')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  view === 'deals' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {language === 'en' ? 'Deals' : 'डील्स'}
              </button>
              <button
                onClick={() => setView('products')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  view === 'products' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {language === 'en' ? 'Products' : 'उत्पाद'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Quick Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(selectedCategory === category.id.toString() ? '' : category.id.toString())}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              selectedCategory === category.id.toString()
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {language === 'en' ? category.name : category.nameHi}
          </button>
        ))}
      </div>

      {/* Content */}
      {view === 'deals' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {language === 'en' ? 'Active Group Deals' : 'सक्रिय समूह डील्स'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredDeals.length} {language === 'en' ? 'deals found' : 'डील्स मिलीं'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} userRole="vendor" />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {language === 'en' ? 'All Products' : 'सभी उत्पाद'}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredProducts.length} {language === 'en' ? 'products found' : 'उत्पाद मिले'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {language === 'en' ? 'MOQ' : 'न्यूनतम'}: {product.moq}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₹{product.bulkPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? 
                        (language === 'en' ? 'In Stock' : 'स्टॉक में') : 
                        (language === 'en' ? 'Out of Stock' : 'स्टॉक खत्म')
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(view === 'deals' ? filteredDeals : filteredProducts).length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {language === 'en' ? 'No results found' : 'कोई परिणाम नहीं मिला'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {language === 'en' 
              ? 'Try adjusting your search or filter criteria.'
              : 'अपनी खोज या फ़िल्टर मानदंड को समायोजित करने का प्रयास करें।'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductBrowser;
