import React from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { format } from 'date-fns';
import { MessageCircle, Eye } from 'lucide-react';

const VendorOrders = () => {
  const { orders, deals } = useData();
  const { language } = useLanguage();

  const myOrders = orders.filter(order => order.vendorId === 1); // Current user

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: { en: 'Pending', hi: 'लंबित' },
      confirmed: { en: 'Confirmed', hi: 'पुष्ट' },
      shipped: { en: 'Shipped', hi: 'भेज दिया' },
      delivered: { en: 'Delivered', hi: 'डिलीवर' }
    };
    return statusMap[status]?.[language] || status;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'My Orders' : 'मेरे ऑर्डर'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {language === 'en' 
            ? 'Track and manage your orders from group buying deals.'
            : 'समूह खरीदारी डील्स से अपने ऑर्डर को ट्रैक और प्रबंधित करें।'
          }
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Order Details' : 'ऑर्डर विवरण'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Product' : 'उत्पाद'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Quantity' : 'मात्रा'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Amount' : 'राशि'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Status' : 'स्थिति'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Actions' : 'कार्य'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myOrders.map((order) => {
                const deal = deals.find(d => d.id === order.dealId);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={deal?.product?.image}
                          alt={deal?.product?.title}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {deal?.product?.title || 'Unknown Product'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {language === 'en' ? 'Deal' : 'डील'} #{order.dealId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      {order.whatsappSent && (
                        <div className="flex items-center mt-1">
                          <MessageCircle className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-xs text-green-600">
                            {language === 'en' ? 'WhatsApp sent' : 'व्हाट्सऐप भेजा गया'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {language === 'en' ? 'View' : 'देखें'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {myOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {language === 'en' ? 'No orders yet' : 'अभी तक कोई ऑर्डर नहीं'}
          </h3>
          <p className="text-gray-500">
            {language === 'en' 
              ? 'Start browsing products and join group deals to place your first order.'
              : 'उत्पादों को ब्राउज़ करना शुरू करें और अपना पहला ऑर्डर देने के लिए समूह डील्स में शामिल हों।'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
