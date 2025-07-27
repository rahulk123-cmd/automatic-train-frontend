import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (error, message) => {
    console.error(message, error);
    setError(`${message}: ${error.message}`);
  };

  // --- User Management ---
  const fetchUsers = async (filter = {}) => {
    setLoading(true);
    try {
      let query = supabase.from('user_profiles').select('*');
      if (filter.role) {
        query = query.eq('role', filter.role);
      }
      const { data, error } = await query;
      if (error) throw error;
      setUsers(data || []);
    } catch (e) {
      handleError(e, 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserVerification = async (userId, isVerified) => {
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .update({ is_verified: isVerified })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        setUsers(prevUsers => 
            prevUsers.map(user => user.id === userId ? data : user)
        );
    } catch (e) {
        handleError(e, 'Failed to update user verification status');
    } finally {
        setLoading(false);
    }
  };

  // --- Category Management ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (e) {
      handleError(e, 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categories').insert(categoryData).select().single();
      if (error) throw error;
      setCategories(prev => [...prev, data]);
    } catch(e) {
      handleError(e, 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };
  
  const updateCategory = async (id, categoryData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('categories').update(categoryData).eq('id', id).select().single();
      if (error) throw error;
      setCategories(prev => prev.map(c => c.id === id ? data : c));
    } catch(e) {
      handleError(e, 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch(e) {
      handleError(e, 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };


  // --- Product Management ---
  const fetchProducts = async (supplierId = null) => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*, categories(name, name_hi)');
      if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      }
      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (e) {
      handleError(e, 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    setLoading(true);
    try {
        const { data, error } = await supabase.from('products').insert(productData).select('*, categories(name, name_hi)').single();
        if (error) throw error;
        setProducts(prev => [...prev, data]);
    } catch (e) {
        handleError(e, 'Failed to add product');
    } finally {
        setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    setLoading(true);
    try {
        const { data, error } = await supabase.from('products').update(productData).eq('id', id).select('*, categories(name, name_hi)').single();
        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === id ? data : p));
    } catch (e) {
        handleError(e, 'Failed to update product');
    } finally {
        setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
        handleError(e, 'Failed to delete product');
    } finally {
        setLoading(false);
    }
  };
  
  // --- Deal & Order Management ---
  const fetchDeals = async (supplierId = null) => {
    setLoading(true);
    try {
      let query = supabase.from('deals').select('*, products(*)');
      if (supplierId) {
        query = query.eq('supplier_id', supplierId);
      }
      const { data, error } = await query;
      if (error) throw error;
      setDeals(data || []);
    } catch(e) {
      handleError(e, 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };
  
  const startDeal = async (dealData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('deals').insert(dealData).select('*, products(*)').single();
      if (error) throw error;
      setDeals(prev => [...prev, data]);
    } catch (e) {
      handleError(e, 'Failed to start deal');
    } finally {
      setLoading(false);
    }
  };

  const updateDeal = async (dealId, updateData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('deals').update(updateData).eq('id', dealId).select('*, products(*)').single();
      if (error) throw error;
      setDeals(prev => prev.map(d => d.id === dealId ? data : d));
    } catch (e) {
      handleError(e, 'Failed to update deal');
    } finally {
      setLoading(false);
    }
  };

  const approveDeal = (dealId) => updateDeal(dealId, { is_approved: true });
  const rejectDeal = (dealId) => updateDeal(dealId, { is_approved: false, status: 'rejected' });

  const fetchOrders = async (options = {}) => {
    setLoading(true);
    try {
      let query = supabase.from('orders').select('*, deals(*, products(*)), user_profiles!orders_vendor_id_fkey(*)');
      if (options.vendorId) {
        query = query.eq('vendor_id', options.vendorId);
      }
      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch(e) {
      handleError(e, 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (orderId, updateData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders').update(updateData).eq('id', orderId).select().single();
      if (error) throw error;
      await fetchOrders(); // Refetch to get fresh joined data
    } catch (e) {
      handleError(e, 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const joinDeal = async ({ dealId, vendorId, quantity, totalAmount }) => {
    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          deal_id: dealId,
          vendor_id: vendorId,
          quantity,
          total_amount: totalAmount,
          status: 'confirmed',
          payment_method: 'UPI',
        })
        .select()
        .single();
      if (orderError) throw orderError;

      const { error: rpcError } = await supabase.rpc('increment_deal_counts', {
        deal_id_to_update: dealId,
        quantity_to_add: quantity,
      });
      if (rpcError) throw rpcError;

      await fetchDeals();
      await fetchOrders();
      return { success: true, order: orderData };
    } catch (e) {
      handleError(e, 'Failed to join deal');
      return { success: false, error: e };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    users,
    products,
    categories,
    deals,
    orders,
    loading,
    error,
    fetchUsers,
    updateUserVerification,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchDeals,
    startDeal,
    updateDeal,
    approveDeal,
    rejectDeal,
    fetchOrders,
    updateOrder,
    joinDeal,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
