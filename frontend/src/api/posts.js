// frontend/src/api/posts.js
import { apiClient } from './config';

export const postsAPI = {
    getAllPosts: async () => {
        const response = await apiClient.get('/posts');
        return response;
    },

    getPost: async (postId) => {
        const response = await apiClient.get(`/posts/${postId}`);
        return response;
    },

    createPost: async (postData) => {
        const response = await apiClient.post('/posts', postData);
        return response;
    },

    updatePost: async (postId, postData) => {
        const response = await apiClient.put(`/posts/${postId}`, postData);
        return response;
    },

    deletePost: async (postId) => {
        const response = await apiClient.delete(`/posts/${postId}`);
        return response;
    }
};