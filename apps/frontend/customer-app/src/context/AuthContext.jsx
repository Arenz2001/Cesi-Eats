"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [logoutCallbacks, setLogoutCallbacks] = useState([]);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            setAccessToken(storedToken);
            fetchUserProfile(storedToken);
        }
        setLoading(false);
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            console.log('Fetching user profile from:', `${process.env.NEXT_PUBLIC_CUSTOMER_API_URL}/me`);
            const response = await fetch(`${process.env.NEXT_PUBLIC_CUSTOMER_API_URL}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Profile response status:', response.status);
            if (response.ok) {
                const userData = await response.json();
                console.log('User profile data:', userData);
                setUser(userData);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Profile error response:', errorData);
                throw new Error(errorData.message || 'Erreur lors de la récupération du profil');
            }
        } catch (err) {
            console.error('Erreur profil:', err);
            logout();
        }
    };

    const registerLogoutCallback = useCallback((callback) => {
        setLogoutCallbacks(prev => [...prev, callback]);
        return () => {
            setLogoutCallbacks(prev => prev.filter(cb => cb !== callback));
        };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setUser(null);
        setError(null);
        logoutCallbacks.forEach(callback => callback());
        router.push('/login');
    }, [logoutCallbacks, router]);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            console.log('Login attempt to:', `${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`);
            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            });

            console.log('Login response status:', response.status);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Login error response:', errorData);
                throw new Error(errorData.message || 'Identifiants invalides');
            }

            const data = await response.json();
            console.log('Login success data:', data);
            localStorage.setItem('accessToken', data.token);
            setAccessToken(data.token);
            await fetchUserProfile(data.token);
            router.push('/profil');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = () => {
        return !!accessToken;
    };

    return (
        <AuthContext.Provider value={{
            accessToken,
            error,
            loading,
            user,
            login,
            logout,
            isAuthenticated,
            registerLogoutCallback
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

