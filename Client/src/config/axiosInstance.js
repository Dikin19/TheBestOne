import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:3000/'
});

// Response interceptor to handle authentication errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // If we get a 401 error (unauthorized), clear the invalid token
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            // Only clear tokens if we're not already on login/register pages
            if (currentPath !== '/login' && currentPath !== '/register') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('email');
                localStorage.removeItem('profilePicture');
                // Redirect to login page
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance