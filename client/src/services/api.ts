import axios from "axios";

// This checks if a production URL exists, otherwise it falls back to localhost for testing
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log('API Request - Token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
  
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set');
  } else {
    console.warn('No token in localStorage');
  }
  return config;
});

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Received 401 Unauthorized - clearing auth');
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('adminInfo');
    }
    return Promise.reject(error);
  }
);