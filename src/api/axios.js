import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Refresh-token state 
let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingRequests = [];
};

// Request interceptor 
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization:
          `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor 
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: skip if not a 401, or if the failing request is the refresh
    // endpoint itself, or if we already retried this request once.
    const isUnauthorized = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh-token');
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register');

    if (!isUnauthorized || isRefreshEndpoint || isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in-flight, queue this request until it settles.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axiosInstance.post('/auth/refresh-token');
      const newToken = data.data.accessToken;

      localStorage.setItem('accessToken', newToken);

      processQueue(null, newToken);

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newToken}`,
      };
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      localStorage.removeItem('accessToken');
      // Removed: window.location.href = '/login' — causes hard reload

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
