import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Attach JWT from localStorage to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('govihanda_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  getUserById: (id) => api.get(`/users/${id}`),
  getAllUsers: (params) => api.get('/users', { params }),
  setUserStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
};

// ─── Products ────────────────────────────────────────────────────────────────
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getMyProducts: (params) => api.get('/products/my', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (formData) =>
    api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// ─── Bids ────────────────────────────────────────────────────────────────────
export const bidAPI = {
  placeBid: (data) => api.post('/bids', data),
  getMyBids: (params) => api.get('/bids/my-bids', { params }),
  getBidsForProduct: (productId) => api.get(`/bids/product/${productId}`),
  acceptBid: (id) => api.put(`/bids/${id}/accept`),
  rejectBid: (id) => api.put(`/bids/${id}/reject`),
  withdrawBid: (id) => api.put(`/bids/${id}/withdraw`),
};

// ─── Transactions ────────────────────────────────────────────────────────────
export const transactionAPI = {
  getMyTransactions: (params) => api.get('/transactions/my', { params }),
  getTransactionById: (id) => api.get(`/transactions/${id}`),
  updateStatus: (id, data) => api.put(`/transactions/${id}/status`, data),
  getAllTransactions: (params) => api.get('/transactions', { params }),
};

// ─── Service Providers ───────────────────────────────────────────────────────
export const providerAPI = {
  registerProvider: (data) => api.post('/providers/register', data),
  getProviders: (params) => api.get('/providers', { params }),
  getProviderById: (id) => api.get(`/providers/${id}`),
  getMyProfile: () => api.get('/providers/my'),
  updateProvider: (id, data) => api.put(`/providers/${id}`, data),
  approveProvider: (id) => api.put(`/providers/${id}/approve`),
  rejectProvider: (id, reason) => api.put(`/providers/${id}/reject`, { reason }),
  getAllProvidersAdmin: (params) => api.get('/providers/admin/all', { params }),
};

// ─── Ratings ─────────────────────────────────────────────────────────────────
export const ratingAPI = {
  submitRating: (data) => api.post('/ratings', data),
  getUserRatings: (userId) => api.get(`/ratings/user/${userId}`),
  getProviderRatings: (providerId) => api.get(`/ratings/provider/${providerId}`),
  moderateRating: (id, isHidden) => api.put(`/ratings/${id}/moderate`, { isHidden }),
};

// ─── Market Info ─────────────────────────────────────────────────────────────
export const marketInfoAPI = {
  getMarketInfo: (params) => api.get('/market-info', { params }),
  createMarketInfo: (data) => api.post('/market-info', data),
  updateMarketInfo: (id, data) => api.put(`/market-info/${id}`, data),
  deleteMarketInfo: (id) => api.delete(`/market-info/${id}`),
};

export default api;
