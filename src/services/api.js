import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/users/me'),
};

// Vendors API
export const vendorsAPI = {
  getAll: (params) => api.get('/vendors', { params }),
  getMe: () => api.get('/vendors/me'),
  create: (vendorData) => api.post('/vendors', vendorData),
  update: (vendorData) => api.put('/vendors/me', vendorData),
  getById: (id) => api.get(`/vendors/${id}`),
  updateById: (id, vendorData) => api.put(`/vendors/${id}`, vendorData),
  deleteById: (id) => api.delete(`/vendors/${id}`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: (params) => api.get('/suppliers', { params }),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (supplierData) => api.post('/suppliers', supplierData),
  update: (id, supplierData) => api.put(`/suppliers/${id}`, supplierData),
  approve: (id, status) => api.put(`/suppliers/${id}/approve`, { status }),
  getCategories: () => api.get('/suppliers/categories'),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
};

// Group Orders API
export const groupOrdersAPI = {
  getAll: (params) => api.get('/group-orders', { params }),
  getById: (id) => api.get(`/group-orders/${id}`),
  create: (orderData) => api.post('/group-orders', orderData),
  confirm: (id, data) => api.put(`/group-orders/${id}/confirm`, data),
  join: (id, data) => api.put(`/group-orders/${id}/join`, data),
  getParticipants: (id) => api.get(`/group-orders/${id}/participants`),
};

// Admin API
export const adminAPI = {
  getDashboardMetrics: () => api.get('/admin/dashboard/metrics'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  approveSupplier: (id, status) => api.put(`/admin/approve-supplier/${id}`, { status }),
  getPendingSuppliers: () => api.get('/admin/pending-suppliers'),
  getSystemStats: () => api.get('/admin/system-stats'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 