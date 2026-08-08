import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT Bearer token ──────────────────────────────
api.interceptors.request.use((config) => {
  // Read token directly from localStorage to avoid circular dependency with authStore
  try {
    const raw = localStorage.getItem('skillforge-auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      const token = parsed?.state?.token
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
  } catch {
    // ignore parse errors
  }
  return config
})

// ── Response interceptor: unwrap Spring Boot ApiResponse<T> wrapper ───────────
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
