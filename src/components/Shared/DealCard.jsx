import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, Users, ShoppingCart, Loader } from 'lucide-react';
import UPIPaymentModal from './UPIPaymentModal';

const DealCard = ({ deal }) => {
  const { joinDeal, loading } = useData();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isJoining, setIsJoining] = useState(false);

  if (!deal || !deal.products) {
    return null;
  }

  const timeLeft = new Date(deal.end_time) - new Date();
  const daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));
  const progress = deal.moq > 0 ? (deal.current_count / deal.moq) * 100 : 0;

  const handleJoinClick = () => {
    if (user?.role === 'vendor') {
      setShowPayment(true);
    }
  };

  const handlePaymentComplete = async () => {
    setIsJoining(true);
    await joinDeal({
      dealId: deal.id,
      vendorId: user.id,
      quantity,
      totalAmount: deal.products.bulk_price * quantity,
    });
    setShowPayment(false);
    setIsJoining(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden flex flex-col">
        <img
          src={deal.products.image_url}
          alt={deal.products.title}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 flex-grow">
            {deal.products.title}
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
              {deal.participants_count || 0}
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{language === 'en' ? 'Progress' : 'प्रगति'}</span>
              <span>{deal.current_count || 0}/{deal.moq}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-4 mt-auto">
            <div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Bulk Price' : 'थोक मूल्य'}
              </div>
              <div className="text-xl font-bold text-gray-900">
                ₹{deal.products.bulk_price.toFixed(2)}
              </div>
            </div>
          </div>

          {user?.role === 'vendor' && deal.status === 'active' && deal.is_approved && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Qty:' : 'मात्रा:'}
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
                onClick={handleJoinClick}
                disabled={isJoining || loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isJoining ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
                {isJoining ? (language === 'en' ? 'Joining...' : 'शामिल हो रहे हैं...') : (language === 'en' ? 'Join Deal' : 'डील में शामिल हों')}
              </button>
              
              <div className="text-center text-sm text-gray-600">
                {language === 'en' ? 'Total:' : 'कुल:'} ₹{(deal.products.bulk_price * quantity).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>

      {showPayment && (
        <UPIPaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
          amount={deal.products.bulk_price * quantity}
          dealTitle={deal.products.title}
          quantity={quantity}
        />
      )}
    </>
  );
};

export default DealCard;
