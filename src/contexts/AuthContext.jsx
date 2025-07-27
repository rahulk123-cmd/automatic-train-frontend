import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await authAPI.getMe();
        // Ensure user object has a role property
        let user = response.data;
        if (user && !user.role) {
          user.role = 'vendor';
        }
        setUser(user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      // Only send required fields to backend
      const payload = {
        email: userData.email,
        password: userData.password,
        role: userData.role
      };
      const response = await authAPI.signup(payload);
      // Backend returns user in response.data.data.user
      const { user: newUser } = response.data.data;
      setUser(newUser);
      // If backend returns a token, store it
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      localStorage.setItem('user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      // Show backend error message if available
      console.log('Signup error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      // Backend returns user in response.data.user
      const { user: loggedInUser, token } = response.data.data || response.data;
      // Ensure user object has a role property
      let userWithRole = loggedInUser;
      if (userWithRole && !userWithRole.role) {
        userWithRole.role = 'vendor';
      }
      if (!userWithRole || !userWithRole.id) {
        setError('Login failed: invalid user data.');
        return { success: false, error: 'Invalid user data from server.' };
      }
      setUser(userWithRole);
      if (token) {
        localStorage.setItem('authToken', token);
      }
      localStorage.setItem('user', JSON.stringify(userWithRole));
      return { success: true, user: userWithRole };
    } catch (error) {
      // Show backend error message if available
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      setError(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refresh();
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    refreshToken,
    updateUser,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
