import React, { createContext, useContext, useState, useEffect } from 'react';
import { productsAPI, suppliersAPI, groupOrdersAPI, adminAPI } from '../services/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [groupOrders, setGroupOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsRes, suppliersRes, categoriesRes] = await Promise.all([
        productsAPI.getAll({ limit: 50 }),
        suppliersAPI.getAll({ status: 'approved' }),
        productsAPI.getCategories()
      ]);

      setProducts(productsRes.data.data || []);
      setSuppliers(suppliersRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      if (error.response) {
        console.error('Failed to load initial data:', error.response.data || error.response);
      } else {
        console.error('Failed to load initial data:', error);
      }
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Products
  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(params);
      setProducts(response.data.data || []);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      setLoading(true);
      const response = await productsAPI.create(productData);
      const newProduct = response.data;
      setProducts(prev => [...prev, newProduct]);
      addNotification({
        type: 'success',
        message: 'Product added successfully',
        timestamp: new Date()
      });
      return newProduct;
    } catch (error) {
      console.error('Failed to add product:', error);
      setError('Failed to add product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      setLoading(true);
      const response = await productsAPI.update(id, productData);
      const updatedProduct = response.data;
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      addNotification({
        type: 'success',
        message: 'Product updated successfully',
        timestamp: new Date()
      });
      return updatedProduct;
    } catch (error) {
      console.error('Failed to update product:', error);
      setError('Failed to update product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      addNotification({
        type: 'success',
        message: 'Product deleted successfully',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Suppliers
  const fetchSuppliers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await suppliersAPI.getAll(params);
      setSuppliers(response.data.data || []);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      setError('Failed to load suppliers');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addSupplier = async (supplierData) => {
    try {
      setLoading(true);
      const response = await suppliersAPI.create(supplierData);
      const newSupplier = response.data;
      setSuppliers(prev => [...prev, newSupplier]);
      addNotification({
        type: 'success',
        message: 'Supplier added successfully',
        timestamp: new Date()
      });
      return newSupplier;
    } catch (error) {
      console.error('Failed to add supplier:', error);
      setError('Failed to add supplier');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id, supplierData) => {
    try {
      setLoading(true);
      const response = await suppliersAPI.update(id, supplierData);
      const updatedSupplier = response.data;
      setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
      addNotification({
        type: 'success',
        message: 'Supplier updated successfully',
        timestamp: new Date()
      });
      return updatedSupplier;
    } catch (error) {
      console.error('Failed to update supplier:', error);
      setError('Failed to update supplier');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Group Orders
  const fetchGroupOrders = async (params = {}) => {
    try {
      setLoading(true);
      const response = await groupOrdersAPI.getAll(params);
      setGroupOrders(response.data.data || []);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch group orders:', error);
      setError('Failed to load group orders');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createGroupOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await groupOrdersAPI.create(orderData);
      const newOrder = response.data;
      setGroupOrders(prev => [...prev, newOrder]);
      addNotification({
        type: 'success',
        message: 'Group order created successfully',
        timestamp: new Date()
      });
      return newOrder;
    } catch (error) {
      console.error('Failed to create group order:', error);
      setError('Failed to create group order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const joinGroupOrder = async (orderId, joinData) => {
    try {
      setLoading(true);
      const response = await groupOrdersAPI.join(orderId, joinData);
      const updatedOrder = response.data;
      setGroupOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      addNotification({
        type: 'success',
        message: 'Successfully joined group order',
        timestamp: new Date()
      });
      return updatedOrder;
    } catch (error) {
      console.error('Failed to join group order:', error);
      setError('Failed to join group order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmGroupOrder = async (orderId, confirmData) => {
    try {
      setLoading(true);
      const response = await groupOrdersAPI.confirm(orderId, confirmData);
      const updatedOrder = response.data;
      setGroupOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      addNotification({
        type: 'success',
        message: 'Group order confirmed successfully',
        timestamp: new Date()
      });
      return updatedOrder;
    } catch (error) {
      console.error('Failed to confirm group order:', error);
      setError('Failed to confirm group order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Admin functions
  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardMetrics();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      setError('Failed to load dashboard metrics');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers(params);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveSupplier = async (supplierId, status) => {
    try {
      setLoading(true);
      const response = await adminAPI.approveSupplier(supplierId, status);
      const updatedSupplier = response.data;
      setSuppliers(prev => prev.map(s => s.id === supplierId ? updatedSupplier : s));
      addNotification({
        type: 'success',
        message: `Supplier ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
        timestamp: new Date()
      });
      return updatedSupplier;
    } catch (error) {
      console.error('Failed to approve supplier:', error);
      setError('Failed to approve supplier');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Notifications
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    products,
    suppliers,
    groupOrders,
    categories,
    notifications,
    loading,
    error,
    
    // Product functions
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Supplier functions
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    
    // Group Order functions
    fetchGroupOrders,
    createGroupOrder,
    joinGroupOrder,
    confirmGroupOrder,
    
    // Admin functions
    fetchDashboardMetrics,
    fetchAllUsers,
    approveSupplier,
    
    // Utility functions
    addNotification,
    clearNotifications,
    clearError,
    loadInitialData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
