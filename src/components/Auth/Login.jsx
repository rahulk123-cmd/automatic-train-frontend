import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user, isAuthenticated } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // This effect handles redirection after a successful login.
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      // Clear any login errors on successful authentication
      if (error) setError(''); 
      navigate(`/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate, error]);

  // This effect checks for error messages passed from other routes (e.g., ProtectedRoute).
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      // Clear the location state to prevent the error from re-appearing on refresh.
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const result = await login(email, password);
  
    setLoading(false);
    
    if (!result.success) {
      // This will catch errors from the login attempt itself (e.g., wrong password).
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    // On success, the redirection useEffect will handle navigation.
    // If there's a role issue, the user will be redirected back here,
    // and the second useEffect will catch and display the error message.
  };

  const demoCredentials = [
    { email: 'vendor@test.com', password: 'password', role: 'Vendor', roleHi: 'विक्रेता' },
    { email: 'supplier1@email.com', password: 'password123', role: 'Supplier', roleHi: 'आपूर्तिकर्ता' },
    { email: 'admin@test.com', password: 'password', role: 'Admin', roleHi: 'व्यवस्थापक' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Trusted Supplier' : 'विश्वसनीय आपूर्तिकर्ता'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' ? 'Marketplace' : 'बाज़ार'}
            </p>
            <button
              onClick={toggleLanguage}
              className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'en' ? 'Enter your email' : 'अपना ईमेल दर्ज करें'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'en' ? 'Enter your password' : 'अपना पासवर्ड दर्ज करें'}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? (language === 'en' ? 'Signing in...' : 'साइन इन...') : t('login')}
            </button>
          </form>

          <p className="mt-4 text-center">
            Don't have an account? <a href="/register" className="text-blue-600">Register</a>
          </p>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              {language === 'en' ? 'Demo Credentials:' : 'डेमो क्रेडेंशियल:'}
            </h3>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword(cred.password);
                  }}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-sm">
                    {language === 'en' ? cred.role : cred.roleHi}
                  </div>
                  <div className="text-xs text-gray-600">{cred.email} / {cred.password}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
