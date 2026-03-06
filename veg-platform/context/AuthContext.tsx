'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    username: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('vegfresh-admin-token');
        const savedUsername = localStorage.getItem('vegfresh-admin-username');
        if (savedToken && savedUsername) {
            setToken(savedToken);
            setUsername(savedUsername);
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const data = await res.json();
                setToken(data.token);
                setUsername(data.username);
                setIsAuthenticated(true);
                localStorage.setItem('vegfresh-admin-token', data.token);
                localStorage.setItem('vegfresh-admin-username', data.username);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUsername(null);
        setIsAuthenticated(false);
        localStorage.removeItem('vegfresh-admin-token');
        localStorage.removeItem('vegfresh-admin-username');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
