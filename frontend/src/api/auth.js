// frontend/src/api/auth.js
import { apiClient } from './config';

export const authAPI = {
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response;
    },

    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response;
    },

    logout: async () => {
        const response = await apiClient.get('/auth/logout');
        return response;
    },

    getStatus: async () => {
        const response = await apiClient.get('/auth/status');
        return response;
    }
};