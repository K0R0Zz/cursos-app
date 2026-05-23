import { createContext, useContext, useState, type ReactNode } from 'react';
import { request } from '../api/Client';

// Tipos
interface AuthContextType {
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

// Contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem('token')
    );

    const login = async (username: string, password: string) => {
        const data = await request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }) as { token: string };

        localStorage.setItem('token', data.token);
        setToken(data.token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
}