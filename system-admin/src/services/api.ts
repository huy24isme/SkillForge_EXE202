import axios from 'axios';

const api = axios.create({
  baseURL: ((import.meta as any).env?.VITE_API_BASE_URL as string) || 'http://localhost:8081/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT Bearer token
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('system-admin-auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

// Response interceptor: unwrap Spring Boot ApiResponse<T> wrapper
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) throw new Error(body.message || 'Lỗi từ server');
      return body.data;
    }
    return body;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Lỗi không xác định';
    return Promise.reject(new Error(message));
  }
);

export default api;
