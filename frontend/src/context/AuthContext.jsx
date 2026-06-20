import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Render Backend URL
const API_URL = 'https://carbon-footprint-tracker-wk54.onrender.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const bootstrapUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/auth/profile`
        );

        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.error('Session bootstrap failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    bootstrapUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return true;
      }

      return false;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Login failed. Please try again.';

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        { name, email, password }
      );

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return true;
      }

      return false;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Registration failed. Please check inputs.';

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
  };

  const updateBudget = async (monthlyBudget) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/auth/budget`,
        { monthlyBudget }
      );

      if (response.data.success) {
        setUser((prev) =>
          prev ? { ...prev, monthlyBudget } : null
        );
        return true;
      }

      return false;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Could not update carbon budget target';

      throw new Error(message);
    }
  };

  const reloadProfile = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/auth/profile`
      );

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err) {
      console.error('Failed to sync profile:', err);
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
