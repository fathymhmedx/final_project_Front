import axiosInstance from './axios';

/**
 * POST /auth/login
 * Response: { status: 'success', message: '...', accessToken: 'jwt' }
 */
export const login = async (email, password) => {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  return data;
};

/**
 * POST /auth/register
 * Response: { status: 'success', message: '...', data: { id, name, email, accessToken } }
 */
export const register = async (name, email, password) => {
  const { data } = await axiosInstance.post('/auth/register', { name, email, password });
  return data;
};

/**
 * POST /auth/logout  (protected)
 */
export const logout = async () => {
  const { data } = await axiosInstance.post('/auth/logout');
  return data;
};

/**
 * POST /auth/refresh-token
 * Response: { status: 'success', data: { accessToken: 'new' } }
 */
export const refreshToken = async () => {
  const { data } = await axiosInstance.post('/auth/refresh-token');
  return data;
};

/**
 * GET /users/me  (protected)
 * Returns the current user profile.
 */
export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get('/users/me');
  return data;
};
