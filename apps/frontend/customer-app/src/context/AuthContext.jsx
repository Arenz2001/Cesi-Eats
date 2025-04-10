"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser } from "@/utils/api";
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
        // Récupérer le token stocké au chargement
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            setAccessToken(storedToken);
            // TODO: Ajouter une validation du token ici
            // fetchUserProfile(storedToken);
        }
        setLoading(false);
    }, []);

    // const fetchUserProfile = async (token) => {
    //     try {
    //         const response = await fetch('https://auth-cesieats.arenz-proxmox.fr/api/users/me', {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //         if (response.ok) {
    //             const userData = await response.json();
    //             setUser(userData);
    //         } else {
    //             throw new Error('Erreur lors de la récupération du profil');
    //         }
    //     } catch (err) {
    //         console.error('Erreur profil:', err);
    //         logout();
    //     }
    // };

    const registerLogoutCallback = useCallback((callback) => {
        setLogoutCallbacks(prev => [...prev, callback]);
        // Retourner une fonction de nettoyage pour désenregistrer le callback
        return () => {
            setLogoutCallbacks(prev => prev.filter(cb => cb !== callback));
        };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setUser(null);
        setError(null);
        // Exécuter tous les callbacks de déconnexion
        logoutCallbacks.forEach(callback => callback());
        router.push('/login');
    }, [logoutCallbacks, router]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch('https://auth-cesieats.arenz-proxmox.fr/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Identifiants invalides');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.token);
            setAccessToken(data.token);
            await fetchUserProfile(data.token);
            setError(null);
            router.push('/profil');
        } catch (err) {
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

