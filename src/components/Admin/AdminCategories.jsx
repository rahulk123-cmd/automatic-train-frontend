import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminCategories = () => {
  const { categories, setCategories } = useData();
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', nameHi: '', icon: '' });

  const handleAdd = () => {
    setCategories(prev => [...prev, { ...newCategory, id: Date.now() }]);
    setIsModalOpen(false);
    setNewCategory({ name: '', nameHi: '', icon: '' });
  };

  const handleEdit = () => {
    setCategories(prev => prev.map(c => c.id === editingCategory.id ? editingCategory : c));
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      handleEdit();
    } else {
      handleAdd();
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{language === 'en' ? 'Categories' : 'श्रेणियां'}</h1>
          <p className="mt-1 text-sm text-gray-600">{language === 'en' ? 'Manage product categories.' : 'उत्पाद श्रेणियों का प्रबंधन करें।'}</p>
        </div>
        <button onClick={() => { setEditingCategory(null); setIsModalOpen(true); }} className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
          <Plus className="w-5 h-5 mr-2" />
          {language === 'en' ? 'Add Category' : 'श्रेणी जोड़ें'}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {categories.map(cat => (
            <li key={cat.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-4">{cat.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{cat.name}</p>
                  <p className="text-sm text-gray-500">{cat.nameHi}</p>
                </div>
              </div>
              <div className="space-x-2">
                <button onClick={() => openEditModal(cat)} className="text-blue-600"><Edit className="w-5 h-5" /></button>
                <button onClick={() => handleDelete(cat.id)} className="text-red-600"><Trash2 className="w-5 h-5" /></button>
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
                <h2 className="text-lg font-medium">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium">Name (English)</label>
                  <input
                    type="text"
                    value={editingCategory ? editingCategory.name : newCategory.name}
                    onChange={e => editingCategory ? setEditingCategory({...editingCategory, name: e.target.value}) : setNewCategory({...newCategory, name: e.target.value})}
                    className="mt-1 w-full border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Name (Hindi)</label>
                  <input
                    type="text"
                    value={editingCategory ? editingCategory.nameHi : newCategory.nameHi}
                    onChange={e => editingCategory ? setEditingCategory({...editingCategory, nameHi: e.target.value}) : setNewCategory({...newCategory, nameHi: e.target.value})}
                    className="mt-1 w-full border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={editingCategory ? editingCategory.icon : newCategory.icon}
                    onChange={e => editingCategory ? setEditingCategory({...editingCategory, icon: e.target.value}) : setNewCategory({...newCategory, icon: e.target.value})}
                    className="mt-1 w-full border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="p-4 bg-gray-50 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
