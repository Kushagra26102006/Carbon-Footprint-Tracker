import { createContext, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Use relative path to leverage Vite local dev proxy
const API_URL = '';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logoutRef = useRef(null);

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

  // Set up global axios interceptor to handle 401 errors dynamically
  useEffect(() => {
    logoutRef.current = logout;
  });

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (err) => {
        if (err.response && err.response.status === 401) {
          console.warn('Unauthorized API access (401). Logging out...');
          if (logoutRef.current) {
            logoutRef.current();
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

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
        // Set token synchronously to avoid React state update race conditions
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        localStorage.setItem('token', response.data.token);

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
        // Set token synchronously to avoid React state update race conditions
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        localStorage.setItem('token', response.data.token);

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
