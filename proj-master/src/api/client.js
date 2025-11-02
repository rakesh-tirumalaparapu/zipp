import axios from 'axios';

export const API_BASE = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token') || window.__authToken;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function toErrorMessage(error) {
  if (!error) return 'Unknown error';
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data && typeof error.response.data === 'string') return error.response.data;
  if (error.message) return error.message;
  return 'Request failed';
}


