import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { X, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

const UPIPaymentModal = ({ isOpen, onClose, onComplete, amount, dealTitle, quantity }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState('payment'); // 'payment', 'processing', 'success'
  const [upiId, setUpiId] = useState('');
  const [selectedApp, setSelectedApp] = useState('gpay');

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: '🔵' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
    { id: 'paytm', name: 'Paytm', icon: '🟦' },
    { id: 'other', name: 'Other UPI', icon: '🏦' }
  ];

  useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(() => {
        setStep('success');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handlePayment = () => {
    setStep('processing');
  };

  const handleSuccess = () => {
    onComplete({
      upiId,
      app: selectedApp,
      amount,
      transactionId: `TXN${Date.now()}`
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">
            {language === 'en' ? 'UPI Payment' : 'UPI भुगतान'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {step === 'payment' && (
            <div className="space-y-4">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {language === 'en' ? 'Order Summary' : 'ऑर्डर सारांश'}
                </h3>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{dealTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Quantity:' : 'मात्रा:'}</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 mt-2 pt-2 border-t">
                    <span>{language === 'en' ? 'Total Amount:' : 'कुल राशि:'}</span>
                    <span>₹{amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* UPI App Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Select UPI App' : 'UPI ऐप चुनें'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {upiApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app.id)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        selectedApp === app.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{app.icon}</div>
                      <div className="text-sm font-medium">{app.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI ID Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'UPI ID (Optional)' : 'UPI ID (वैकल्पिक)'}
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@paytm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Pay ₹' : 'भुगतान ₹'}{amount.toFixed(2)}
              </button>

              <p className="text-xs text-gray-500 text-center">
                {language === 'en' 
                  ? 'This is a demo payment. No real transaction will be processed.'
                  : 'यह एक डेमो भुगतान है। कोई वास्तविक लेन-देन संसाधित नहीं होगा।'
                }
              </p>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'en' ? 'Processing Payment...' : 'भुगतान संसाधित हो रहा है...'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Please wait while we process your payment.'
                  : 'कृपया प्रतीक्षा करें जब तक हम आपका भुगतान संसाधित करते हैं।'
                }
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'en' ? 'Payment Successful!' : 'भुगतान सफल!'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'en' 
                  ? 'Your order has been placed successfully. You will receive a WhatsApp confirmation shortly.'
                  : 'आपका ऑर्डर सफलतापूर्वक दिया गया है। आपको जल्द ही व्हाट्सऐप पुष्टि प्राप्त होगी।'
                }
              </p>
              <button
                onClick={handleSuccess}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                {language === 'en' ? 'Continue' : 'जारी रखें'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentModal;
