// frontend/src/api/index.js
import { apiClient } from './config';
import { authAPI } from './auth';
import { postsAPI } from './posts';

// Re-export everything
export {
    apiClient,
    authAPI,
    postsAPI
};