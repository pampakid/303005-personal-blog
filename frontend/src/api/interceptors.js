// frontend/src/api/interceptors.js
import { apiClient } from './config';

apiClient.interceptors.request.use(
    function (config) {
        // You can modify request config here
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    function (response) {
        // Handle successful response here
        return response;
    },
    function (error) {
        // Handle specific HTTP error codes here
        if (error.response) {
            // Handle specific HTTP errors
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized (e.g., redirect to login)
                    break;
                case 403:
                    // Handle forbidden
                    break;
                case 404:
                    // Handle not found
                    break;
                case 500:
                    // Handle server error
                    break;
                default:
                    // Handle other errors
                    break;
            }
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
);

export default apiClient;