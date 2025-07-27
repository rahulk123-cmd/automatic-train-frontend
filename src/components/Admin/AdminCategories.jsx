import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminCategories = () => {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory, loading } = useData();
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', name_hi: '', icon: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      setFormData({ name: category.name, name_hi: category.name_hi, icon: category.icon });
    } else {
      setFormData({ name: '', name_hi: '', icon: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', name_hi: '', icon: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await addCategory(formData);
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm(language === 'en' ? 'Are you sure?' : 'क्या आपको यकीन है?')) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{language === 'en' ? 'Categories' : 'श्रेणियां'}</h1>
          <p className="mt-1 text-sm text-gray-600">{language === 'en' ? 'Manage product categories.' : 'उत्पाद श्रेणियों का प्रबंधन करें।'}</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          {language === 'en' ? 'Add Category' : 'श्रेणी जोड़ें'}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {loading && categories.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">Loading...</li>
          ) : categories.map(cat => (
            <li key={cat.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-4">{cat.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{cat.name}</p>
                  <p className="text-sm text-gray-500">{cat.name_hi}</p>
                </div>
              </div>
              <div className="space-x-2">
                <button onClick={() => openModal(cat)} className="text-blue-600 p-2 rounded-full hover:bg-blue-100"><Edit className="w-5 h-5" /></button>
                <button onClick={() => handleDelete(cat.id)} className="text-red-600 p-2 rounded-full hover:bg-red-100"><Trash2 className="w-5 h-5" /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <form onSubmit={handleSubmit}>
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">{editingCategory ? (language === 'en' ? 'Edit Category' : 'श्रेणी संपादित करें') : (language === 'en' ? 'Add Category' : 'श्रेणी जोड़ें')}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium">Name (English)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Name (Hindi)</label>
                  <input
                    type="text"
                    name="name_hi"
                    value={formData.name_hi}
                    onChange={handleChange}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Icon (Emoji)</label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="p-4 bg-gray-50 flex justify-end space-x-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-white border rounded-md">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
