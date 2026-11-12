import apiClient from '../apiClient';

export const authService = {
  login: async ({ email, password }) => {
    // Exactly matches loginValidation (email, password)
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async ({ fullName, email, password }) => {
    // Exactly matches registerValidation (fullName, email, password)
    const response = await apiClient.post('/auth/register', {
      fullName,
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refresh: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },
};