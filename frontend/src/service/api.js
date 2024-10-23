import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // substitua pelo URL correto do seu backend
});

// Função para registrar um novo usuário
export const registerUser = async (userData) => {
    const response = await api.post('/usuarios', userData);
    return response.data;
};

// Função para obter usuários (opcional)
export const getUsers = async () => {
    const response = await api.get('/usuarios');
    return response.data;
};

// Função para fazer login do usuário
export const loginUser = async (credentials) => {
    const response = await api.post('/usuarios/login', credentials); // ajuste a rota conforme necessário
    return response.data;
};

export default api;
