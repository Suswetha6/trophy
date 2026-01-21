import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, userAPI } from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await userAPI.getCurrentUser();
        setUser(response.data);
      }
    } catch (error) {
      console.log('Not authenticated or connection failed:', error.message);
      if (error.response) {
        console.log('Error response:', error.response.status);
      }
      await AsyncStorage.removeItem('token'); // Clear invalid token
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    await AsyncStorage.setItem('token', response.data.access_token);
    const userResponse = await userAPI.getCurrentUser();
    setUser(userResponse.data);
  };

  const signup = async (userData) => {
    const response = await authAPI.signup(userData);
    // Auto-login after signup
    await login(userData.email, userData.password);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};