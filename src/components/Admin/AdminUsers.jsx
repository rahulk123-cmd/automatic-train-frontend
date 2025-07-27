import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle, XCircle, Eye, Search, Filter, UserCheck, UserX } from 'lucide-react';

const AdminUsers = () => {
  const { users, fetchUsers, loading, updateUserVerification } = useData();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const name = user.full_name || '';
    const email = user.email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleVerification = async (userId, currentStatus) => {
    await updateUserVerification(userId, !currentStatus);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search by name or email...' : 'नाम या ईमेल से खोजें...'}
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
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8">Loading users...</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {(user.full_name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
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
                      {user.is_verified ? (
                        <><CheckCircle className="w-5 h-5 text-green-500 mr-2" /> <span className="text-sm text-green-800">Verified</span></>
                      ) : (
                        <><XCircle className="w-5 h-5 text-yellow-500 mr-2" /> <span className="text-sm text-yellow-800">Pending</span></>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 inline-flex items-center p-2 rounded-full hover:bg-blue-100">
                      <Eye className="w-4 h-4" />
                    </button>
                    {user.is_verified ? (
                       <button onClick={() => handleVerification(user.id, user.is_verified)} className="text-red-600 hover:text-red-900 inline-flex items-center p-2 rounded-full hover:bg-red-100" title="Reject/Revoke">
                          <UserX className="w-4 h-4" />
                       </button>
                    ) : (
                      <button onClick={() => handleVerification(user.id, user.is_verified)} className="text-green-600 hover:text-green-900 inline-flex items-center p-2 rounded-full hover:bg-green-100" title="Approve">
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
