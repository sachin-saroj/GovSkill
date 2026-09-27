import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle explicit HTTP 401 Unauthorized status (genuine credential expiration/invalidation)
    // Preserves session on network drops, timeouts (code ECONNABORTED), or temporary 5xx errors
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('govskill:session_expired'));
        const publicPaths = ['/login', '/', '/citizen', '/verify'];
        const currentPath = window.location.pathname;
        const isPublicPath = publicPaths.some(
          (p) => currentPath === p || (p !== '/' && currentPath.startsWith(p + '/'))
        );
        if (!isPublicPath) {
          window.location.href = '/login?expired=1';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
