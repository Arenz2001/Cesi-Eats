"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usersAPI } from '@/services/api/users.api';
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS } from '@/config/api.config';

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
            try {
                const decodedToken = jwtDecode(storedToken);
                console.log('Token décodé au chargement:', decodedToken);
                if (decodedToken.userId) {
                    fetchUserData(storedToken, decodedToken.userId);
                }
            } catch (error) {
                console.error('Erreur lors du décodage du token:', error);
                logout();
            }
        }
        setLoading(false);
    }, []);

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
        try {
            console.log('Tentative de connexion avec:', { email });

            const response = await fetch(`https://api-cesieats.arenz-proxmox.fr/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            console.log('Statut de la réponse:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Identifiants invalides');
            }

            const data = await response.json();
            console.log('Réponse de login:', data);
            const token = data.token;

            // Décoder le token pour obtenir l'ID utilisateur
            const decodedToken = jwtDecode(token);
            console.log('Token décodé:', decodedToken);

            // // Vérifier la structure du token
            // if (!decodedToken.userId) {
            //     console.error('ID utilisateur non trouvé dans le token');
            //     throw new Error('Format de token invalide');
            // }

            // const userId = decodedToken.userId;
            // console.log('ID utilisateur extrait:', userId);

            localStorage.setItem('accessToken', token);
            setAccessToken(token);

            // await fetchUserData(token, userId);
            setError(null);
            router.push('/accueil');
        } catch (err) {
            console.error('Erreur de login:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async (token, userId) => {
        try {
            console.log('Récupération des données utilisateur pour ID:', userId);
            console.log('Token utilisé:', token);
            const userData = await usersAPI.getUserById(token, userId);
            console.log('Données utilisateur reçues:', userData);
            setUser(userData);
        } catch (error) {
            console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
            logout();
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

