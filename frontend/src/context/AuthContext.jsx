import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync token to Axios default headers whenever it changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user profile context details on boot if token is present
  useEffect(() => {
    const bootstrapUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('/api/auth/profile');
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.error('Session bootstrap failed. Logging out...', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    bootstrapUser();
  }, [token]);

  /**
   * Logs in user with email & password credentials.
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return true;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registers a new user account profile.
   */
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return true;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please check inputs.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out user, clearing states and storage values.
   */
  const logout = () => {
    setToken('');
    setUser(null);
    setError(null);
  };

  /**
   * Updates user's monthly budget limit.
   */
  const updateBudget = async (monthlyBudget) => {
    try {
      const response = await axios.put('/api/auth/budget', { monthlyBudget });
      if (response.data.success) {
        setUser((prev) => prev ? { ...prev, monthlyBudget } : null);
        return true;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Could not update carbon budget target';
      throw new Error(message);
    }
  };

  /**
   * Reloads user profile data to check unlocked achievements badges.
   */
  const reloadProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.error('Failed to sync user profile:', err);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateBudget,
    reloadProfile,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for components to access auth variables
export const useAuth = () => useContext(AuthContext);
