import React, { createContext, useContext, useState, useEffect } from 'react';

// Criação do contexto
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    // Sincroniza o localStorage sempre que 'user' muda
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user)); // Armazenando no localStorage
        } else {
            localStorage.removeItem('user'); // Removendo do localStorage
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
