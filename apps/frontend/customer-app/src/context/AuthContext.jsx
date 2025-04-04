"use client"
import { createContext, useContext, useState } from "react";
import { loginUser } from "@/utils/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    const login = async (username, password) => {
        try {
            const response = await fetch('https://fakestoreapi.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Identifiants invalides');
            }

            const data = await response.json();
            setAccessToken(data.token);
            setError(null);
            router.push('/profil');
        } catch (err) {
            setError(err.message);
        }
    };

    const logout = () => {
        setAccessToken(null);
        setError(null);
        router.push('/login');
    };

    const isAuthenticated = () => {
        return !!accessToken;
    };

    return (
        <AuthContext.Provider value={{ accessToken, error, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

