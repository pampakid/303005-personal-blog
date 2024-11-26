// frontend/src/api/config.js
import axios from 'axios';

const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
    },
};

// Create an instance of axios with default config
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
    withCredentials: true // Important for handling cookies/sessions
});

export { apiClient, API_CONFIG };