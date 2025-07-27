import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react';

const AdminUsers = () => {
  const { users } = useAuth();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesVerification = verificationFilter === '' ||
                               (verificationFilter === 'verified' && user.verified) ||
                               (verificationFilter === 'unverified' && !user.verified);
    
    return matchesSearch && matchesRole && matchesVerification;
  });

  const handleVerifyUser = (userId) => {
    // In a real app, this would make an API call
    console.log('Verifying user:', userId);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'supplier': return 'bg-blue-100 text-blue-800';
      case 'vendor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    const roleMap = {
      admin: { en: 'Admin', hi: 'व्यवस्थापक' },
      supplier: { en: 'Supplier', hi: 'आपूर्तिकर्ता' },
      vendor: { en: 'Vendor', hi: 'विक्रेता' }
    };
    return roleMap[role]?.[language] || role;
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {language === 'en' ? 'User Management' : 'उपयोगकर्ता प्रबंधन'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {language === 'en' 
            ? 'Manage and verify platform users across all roles.'
            : 'सभी भूमिकाओं में प्लेटफॉर्म उपयोगकर्ताओं को प्रबंधित और सत्यापित करें।'
          }
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search users...' : 'उपयोगकर्ता खोजें...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                {language === 'en' ? 'All Roles' : 'सभी भूमिकाएं'}
              </option>
              <option value="vendor">{getRoleText('vendor')}</option>
              <option value="supplier">{getRoleText('supplier')}</option>
              <option value="admin">{getRoleText('admin')}</option>
            </select>
          </div>

          <div>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                {language === 'en' ? 'All Status' : 'सभी स्थिति'}
              </option>
              <option value="verified">
                {language === 'en' ? 'Verified' : 'सत्यापित'}
              </option>
              <option value="unverified">
                {language === 'en' ? 'Unverified' : 'असत्यापित'}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'User' : 'उपयोगकर्ता'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {language === 'en' ? 'Role' : 'भूमिका'}
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.verified ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-sm text-green-800">
                            {language === 'en' ? 'Verified' : 'सत्यापित'}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-500 mr-2" />
                          <span className="text-sm text-red-800">
                            {language === 'en' ? 'Unverified' : 'असत्यापित'}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {language === 'en' ? 'View' : 'देखें'}
                    </button>
                    {!user.verified && (
                      <button
                        onClick={() => handleVerifyUser(user.id)}
                        className="text-green-600 hover:text-green-900 inline-flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {language === 'en' ? 'Verify' : 'सत्यापित करें'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {language === 'en' ? 'No users found' : 'कोई उपयोगकर्ता नहीं मिला'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {language === 'en' 
              ? 'Try adjusting your search or filter criteria.'
              : 'अपनी खोज या फ़िल्टर मानदंड को समायोजित करने का प्रयास करें।'
            }
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">
            {users.filter(u => u.role === 'vendor').length}
          </div>
          <div className="text-sm text-gray-600">
            {language === 'en' ? 'Total Vendors' : 'कुल विक्रेता'}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.role === 'supplier').length}
          </div>
          <div className="text-sm text-gray-600">
            {language === 'en' ? 'Total Suppliers' : 'कुल आपूर्तिकर्ता'}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-orange-600">
            {users.filter(u => u.verified).length}
          </div>
          <div className="text-sm text-gray-600">
            {language === 'en' ? 'Verified Users' : 'सत्यापित उपयोगकर्ता'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
