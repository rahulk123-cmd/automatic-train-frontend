import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Clock, Users, TrendingUp, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import UPIPaymentModal from './UPIPaymentModal';

const DealCard = ({ deal, userRole }) => {
  const { joinDeal } = useData();
  const { language } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const timeLeft = new Date(deal.endTime) - new Date();
  const daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));

  const handleJoinDeal = () => {
    if (userRole === 'vendor') {
      setShowPayment(true);
    }
  };

  const handlePaymentComplete = (paymentData) => {
    joinDeal(deal.id, quantity, 1); // Current vendor ID
    setShowPayment(false);
    setQuantity(1);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden">
        <img
          src={deal.product.image}
          alt={deal.product.title}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {deal.product.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {daysLeft > 0 ? 
                `${daysLeft} ${language === 'en' ? 'days left' : 'दिन बचे'}` :
                (language === 'en' ? 'Expired' : 'समाप्त')
              }
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {deal.participants}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{language === 'en' ? 'Progress' : 'प्रगति'}</span>
              <span>{deal.currentCount}/{deal.moq}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(deal.progress, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm font-medium text-gray-900 mt-1">
              {deal.progress.toFixed(1)}%
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Bulk Price' : 'थोक मूल्य'}
              </div>
              <div className="text-lg font-bold text-gray-900">
                ₹{deal.product.bulkPrice.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Regular' : 'नियमित'}
              </div>
              <div className="text-sm text-gray-500 line-through">
                ₹{deal.product.price.toFixed(2)}
              </div>
            </div>
          </div>

          {userRole === 'vendor' && deal.status === 'active' && deal.approved && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Quantity:' : 'मात्रा:'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                />
              </div>
              
              <button
                onClick={handleJoinDeal}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Join Deal' : 'डील में शामिल हों'}
              </button>
              
              <div className="text-center text-sm text-gray-600">
                {language === 'en' ? 'Total:' : 'कुल:'} ₹{(deal.product.bulkPrice * quantity).toFixed(2)}
              </div>
            </div>
          )}

          {deal.status === 'completed' && (
            <div className="text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <TrendingUp className="w-4 h-4 mr-1" />
                {language === 'en' ? 'Deal Completed' : 'डील पूर्ण'}
              </span>
            </div>
          )}

          {!deal.approved && userRole === 'vendor' && (
            <div className="text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {language === 'en' ? 'Pending Approval' : 'अनुमोदन लंबित'}
              </span>
            </div>
          )}
        </div>
      </div>

      {showPayment && (
        <UPIPaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
          amount={deal.product.bulkPrice * quantity}
          dealTitle={deal.product.title}
          quantity={quantity}
        />
      )}
    </>
  );
};

export default DealCard;
