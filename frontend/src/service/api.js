import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Substitua pelo URL correto do seu backend
});

// Interceptor para adicionar o token de autenticação nas requisições
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user')); // Obtém o usuário do localStorage
    if (user && user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`; // Adiciona o token de autenticação
    }
    return config;
}, (error) => {
    return Promise.reject(error); // Trata erros de configuração
});

// Função para registrar um novo usuário
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/usuarios', userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        throw error; // Lança o erro para ser tratado em outro lugar
    }
};

// Função para buscar um usuário por ID
export const getUserById = async (id) => {
    try {
        const response = await api.get(`/usuarios/${id}`);
        return response.data; // Retorna os dados do usuário
    } catch (error) {
        console.error(`Erro ao buscar usuário com ID ${id}:`, error);
        throw error;
    }
};

// Função para buscar todos os usuários
export const getUsers = async () => {
    try {
        const response = await api.get('/usuarios');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
};

// Função para fazer login
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/usuarios/login', credentials); // Ajuste a rota conforme necessário
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
};

// Função para enviar um novo post
export const postData = async (postData) => {
    try {
        const response = await api.post('/posts', postData); // Ajuste a rota conforme necessário
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar post:', error);
        throw error;
    }
};

export default api;
