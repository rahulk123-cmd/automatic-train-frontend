import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

const SupplierProducts = () => {
  const { products, categories, fetchProducts, fetchCategories, addProduct, updateProduct, deleteProduct, loading } = useData();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchProducts(user.id);
      fetchCategories();
    }
  }, [user]);

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to delete this product?' : 'क्या आप वाकई इस उत्पाद को हटाना चाहते हैं?')) {
      await deleteProduct(productId);
    }
  };

  const handleFormSubmit = async (productData) => {
    const dataToSubmit = {
      title: productData.title,
      description: productData.description,
      moq: parseInt(productData.moq),
      bulk_price: parseFloat(productData.bulkPrice),
      stock: parseInt(productData.stock),
      category_id: parseInt(productData.categoryId),
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, dataToSubmit);
    } else {
      await addProduct({
        ...dataToSubmit,
        supplier_id: user.id,
        image_url: `https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(productData.title)}`,
        is_verified: false, // Default to not verified
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{language === 'en' ? 'My Products' : 'मेरे उत्पाद'}</h1>
          <p className="mt-1 text-sm text-gray-600">{language === 'en' ? 'Manage your product catalog.' : 'अपने उत्पाद कैटलॉग को प्रबंधित करें।'}</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          {language === 'en' ? 'Add Product' : 'उत्पाद जोड़ें'}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bulk Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && products.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Loading products...</td></tr>
              ) : products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={product.image_url} alt={product.title} className="w-10 h-10 rounded object-cover mr-3" />
                      <span className="font-medium text-gray-900">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.categories ? product.categories.name : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.bulk_price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {product.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => openEditModal(product)} className="text-blue-600 p-2 rounded-full hover:bg-blue-100"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 p-2 rounded-full hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          product={editingProduct}
          categories={categories}
          language={language}
          loading={loading}
        />
      )}
    </div>
  );
};

const ProductFormModal = ({ isOpen, onClose, onSubmit, product, categories, language, loading }) => {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    moq: product?.moq || '',
    bulkPrice: product?.bulk_price || '',
    stock: product?.stock || '',
    categoryId: product?.category_id || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">{product ? 'Edit Product' : 'Add Product'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">MOQ</label>
                <input type="number" name="moq" value={formData.moq} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bulk Price (₹)</label>
                <input type="number" step="0.01" name="bulkPrice" value={formData.bulkPrice} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{language === 'en' ? cat.name : cat.name_hi}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border rounded-md">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
              {loading ? 'Saving...' : (product ? 'Save Changes' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierProducts;
