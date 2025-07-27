import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, Lock, Mail } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';


const Login = () => {   
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const navigate = useNavigate();

  // Remove auto-redirect in render; handle after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const result = await login(email, password);
  
    if (result.success) {
      const user = result.user;
      if (!user || !user.id) {
        setError('Login failed: user data missing.');
        setLoading(false);
        return;
      }
  
      // Step 1: Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id, role')
        .eq('id', user.id)
        .single();
  
      let userRole = existingProfile?.role || 'vendor'; // fallback to vendor
  
      // Step 2: If no profile exists, insert one
      if (checkError && checkError.code === 'PGRST116'){
        const { error: insertError } = await supabase.from('user_profiles').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          role: 'vendor', // or dynamic from demoCredentials if you want
        });
  
        if (insertError) {
          console.error('Failed to insert profile:', insertError.message);
          setError('Could not complete login.');
          setLoading(false);
          return;
        }
        userRole = 'vendor';
      }
      // Redirect to dashboard based on user type
      if (userRole === 'vendor') {
        navigate('/vendor');
      } else if (userRole === 'supplier') {
        navigate('/supplier');
      } else if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/vendor'); // fallback
      }
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  
    setLoading(false);
  };
  

  const demoCredentials = [
    { email: 'vendor@test.com', role: 'Vendor', roleHi: 'विक्रेता' },
    { email: 'supplier@test.com', role: 'Supplier', roleHi: 'आपूर्तिकर्ता' },
    { email: 'admin@test.com', role: 'Admin', roleHi: 'व्यवस्थापक' }
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
                    setPassword('password');
                  }}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-sm">
                    {language === 'en' ? cred.role : cred.roleHi}
                  </div>
                  <div className="text-xs text-gray-600">{cred.email}</div>
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
