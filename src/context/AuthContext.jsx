import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../api/authService';

const AuthContext = createContext(null);

// ── Error helpers ────────────────────────────────────────────────────
const parseError = (error) => {
  const res = error.response?.data;

  // Validation errors: { success: false, errors: [{ field, message }] }
  if (res?.errors && Array.isArray(res.errors)) {
    return res.errors.map((e) => e.message).join('. ');
  }

  // General errors: { status: 'fail', message: '...' }
  if (res?.message) {
    return res.message;
  }

  return error.message || 'An unexpected error occurred';
};

// ── Provider ─────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getCurrentUser();
        setUser(data.data?.user || data.user || data.data || data);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Login ────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const data = await authService.login(email, password);

      // accessToken lives at the top level for login
      localStorage.setItem('accessToken', data.accessToken);

      const userData = await authService.getCurrentUser();
      setUser(userData.data?.user || userData.user || userData.data || userData);

      return { success: true };
    } catch (err) {
      const message = parseError(err);
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  // ── Register ─────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const data = await authService.register(name, email, password);

      // accessToken is inside data.data for register
      localStorage.setItem('accessToken', data.data.accessToken);

      const userData = await authService.getCurrentUser();
      setUser(userData.data?.user || userData.user || userData.data || userData);

      return { success: true };
    } catch (err) {
      const message = parseError(err);
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setError(null);
    try {
      await authService.logout();
    } catch {
      // Even if the server call fails we still clear local state
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  // ── Update Profile ────────────────────────────────────────────────
  const updateProfile = useCallback(async (formData) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authService.updateProfile(formData);
      setUser(data.data?.user || data.user || data.data || data);
      return { success: true, message: data.message };
    } catch (err) {
      const message = parseError(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ── Hook ─────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
