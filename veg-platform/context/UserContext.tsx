'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface UserContextType {
    user: UserData | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    token: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('vegfresh-user-token');
        const savedUser = localStorage.getItem('vegfresh-user-data');
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
                setIsLoggedIn(true);
            } catch {
                localStorage.removeItem('vegfresh-user-token');
                localStorage.removeItem('vegfresh-user-data');
            }
        }
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch('/api/auth/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setToken(data.token);
                setUser(data.user);
                setIsLoggedIn(true);
                localStorage.setItem('vegfresh-user-token', data.token);
                localStorage.setItem('vegfresh-user-data', JSON.stringify(data.user));
                return { success: true };
            }
            return { success: false, error: data.error || 'Login failed' };
        } catch {
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const register = async (
        name: string, email: string, phone: string, password: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Auto-login after registration
                return await login(email, password);
            }
            return { success: false, error: data.error || 'Registration failed' };
        } catch {
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('vegfresh-user-token');
        localStorage.removeItem('vegfresh-user-data');
    };

    return (
        <UserContext.Provider value={{ user, isLoggedIn, login, register, logout, token }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
