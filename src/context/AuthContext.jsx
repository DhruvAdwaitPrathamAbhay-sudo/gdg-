import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = 'sfa_jwt';

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const saveToken = (token) => {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch {
            // ignore
        }
    };

    const clearToken = () => {
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch {
            // ignore
        }
    };

    const getToken = () => {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch {
            return null;
        }
    };

    const signup = async (email, password) => {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to sign up');
        saveToken(data.token);
        setCurrentUser({ ...data.user, token: data.token });
        return data.user;
    };

    const login = async (email, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to log in');
        saveToken(data.token);
        setCurrentUser({ ...data.user, token: data.token });
        return data.user;
    };

    const logout = async () => {
        clearToken();
        setCurrentUser(null);
    };

    useEffect(() => {
        const boot = async () => {
            const token = getToken();
            if (!token) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data?.error || 'Session expired');
                setCurrentUser({ ...data.user, token });
            } catch {
                clearToken();
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };
        boot();
    }, []);

    const value = useMemo(() => {
        return {
            currentUser,
            login,
            signup,
            logout,
        };
    }, [currentUser]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
