import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

const API_URL = 'http://10.51.3.155:8000'; // LAN IP for physical device
// const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
};

export const projectAPI = {
  getProjects: (params) => apiClient.get('/projects', { params }),
  getProject: (id) => apiClient.get(`/projects/${id}`),
  createProject: (data) => apiClient.post('/projects', data),
  updateProject: (id, data) => apiClient.put(`/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/projects/${id}`),
  starProject: (id) => apiClient.post(`/projects/${id}/star`),
};

export const userAPI = {
  getCurrentUser: () => apiClient.get('/users/me'),
  getUser: (id) => apiClient.get(`/users/${id}`),
  getDashboard: () => apiClient.get('/dashboard'),
};

export const alertsAPI = {
  broadcast: (data) => apiClient.post('/alerts/broadcast', data),
};

export default apiClient;