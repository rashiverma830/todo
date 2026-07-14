import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});

export const fetchTodos = () => API.get('/todos');
export const createTodo = (newTodo) => API.post('/todos', newTodo);
export const updateTodo = (id, updatedTodo) => API.put(`/todos/${id}`, updatedTodo);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
export const signIn = (formData) => API.post('/auth/login', formData);
export const signUp = (formData) => API.post('/auth/register', formData);
