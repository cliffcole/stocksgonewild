import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL, withCredentials: true });

// Existing functions...
export const getUser = () => api.get('/auth/user');
export const getQuote = (symbol) => api.get(`/api/stock/quote/${symbol}`);
export const getHistory = (symbol, params) => api.get(`/api/stock/history/${symbol}`, { params });

// New: Logout API call
export const logout = () => api.get('/auth/logout');