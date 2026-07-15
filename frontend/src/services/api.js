import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : 'http://localhost:5000/api';

const API = axios.create({ baseURL });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is expired or invalid
            localStorage.removeItem('profile');
            // Force redirect to login if we are not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const fetchTodos = (params) => API.get('/tasks', { params });
export const createTodo = (newTodo) => API.post('/tasks', newTodo);
export const updateTodo = (id, updatedTodo) => API.put(`/tasks/${id}`, updatedTodo);
export const deleteTodo = (id) => API.delete(`/tasks/${id}`);
export const getTaskStats = () => API.get('/tasks/stats');

// Bulk Actions
export const bulkDeleteTasks = (taskIds) => API.post('/tasks/bulk-delete', { taskIds });
export const deleteCompletedTasks = () => API.delete('/tasks/completed');
export const duplicateTask = (id) => API.post(`/tasks/${id}/duplicate`);

export const signIn = (formData) => API.post('/auth/login', formData);
export const signUp = (formData) => API.post('/auth/register', formData);
export const getMe = () => API.get('/auth/me');
export const updateUser = (data) => API.put('/auth/user', data);
