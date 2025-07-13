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

// // Response Interceptor (Global Error Handling)
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (!error.response) {
//             // Network error
//             alert('Network Error: Please check your connection.');
//         } else if (error.response.status === 401) {
//             alert('Session expired. Please log in again.');
//             localStorage.removeItem('token');
//             window.location.href = '/login'; // Redirect to login
//         } else if (error.response.status === 403) {
//             alert('You do not have permission to perform this action.');
//         } else if (error.response.status === 404) {
//             alert('The requested resource could not be found.');
//         } else {
//             alert(error.response.data?.message || 'An unexpected error occurred.');
//         }
//         return Promise.reject(error);
//     }
// );

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        let errorMessage = 'An unexpected error occurred.';
        if (!error.response) {
            // Friendly message for company-side/server issues
            errorMessage = 'Sorry, our service is temporarily unavailable. We are working to fix this. Please try again later.';
        } else if (error.response.status === 401) {
            errorMessage = 'Session expired. Please log in again.';
            localStorage.removeItem('token');
            window.location.href = '/login';
            return Promise.reject(error);
        } else if (error.response.status === 403) {
            errorMessage = 'You do not have permission to perform this action.';
        } else if (error.response.status === 404) {
            errorMessage = 'The requested resource could not be found.';
        } else {
            errorMessage = error.response.data?.message || errorMessage;
        }

        localStorage.setItem('error_message', errorMessage);
        localStorage.setItem('error_prev_url', window.location.pathname);
        window.location.href = '/error';

        return Promise.reject(error);
    }
);

export default axiosInstance;
