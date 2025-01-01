import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (Optional: Add token to headers)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor (Global Error Handling)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            // Network error
            alert('Network Error: Please check your connection.');
        } else if (error.response.status === 401) {
            alert('Session expired. Please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login
        } else if (error.response.status === 403) {
            alert('You do not have permission to perform this action.');
        } else if (error.response.status === 404) {
            alert('The requested resource could not be found.');
        } else {
            alert(error.response.data?.message || 'An unexpected error occurred.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
