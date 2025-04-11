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
        const storedUser = localStorage.getItem('user');
        if (storedToken) {
            setAccessToken(storedToken);
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (err) {
                    console.error('Erreur lors du parsing des données utilisateur:', err);
                    localStorage.removeItem('user');
                }
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
        localStorage.removeItem('user');
        setAccessToken(null);
        setUser(null);
        setError(null);
        logoutCallbacks.forEach(callback => callback());
        router.push('/login');
    }, [logoutCallbacks, router]);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        
        console.log('Tentative de connexion avec email:', email);
        console.log('URL du service Auth:', process.env.NEXT_PUBLIC_AUTH_API_URL);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    role: 'delivery' // Rôle en minuscules, comme dans le register
                })
            });

            console.log('Réponse du service auth:', {
                status: response.status,
                statusText: response.statusText
            });

            if (!response.ok) {
                const errorData = await response.json().catch(e => {
                    console.error('Erreur lors du parsing de la réponse d\'erreur:', e);
                    return { message: 'Erreur inconnue du serveur d\'authentification' };
                });
                console.error('Détails de l\'erreur auth:', errorData);
                throw new Error(errorData.message || 'Identifiants invalides');
            }

            const data = await response.json();
            console.log('Données auth reçues:', {
                tokenReçu: !!data.token,
                userId: data.user?.id,
                userRole: data.user?.role
            });
            
            // Vérifier que l'utilisateur est bien un livreur
            if (data.user?.role !== 'delivery') {
                throw new Error('Accès non autorisé. Compte livreur requis.');
            }
            
            // Stocker le token et les données utilisateur
            localStorage.setItem('accessToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            setAccessToken(data.token);
            setUser(data.user);
            
            router.push('/commandes-disponibles');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || "Une erreur s'est produite lors de la connexion");
        } finally {
            setLoading(false);
        }
    };

    const updateEmail = async (newEmail, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/email`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    email: newEmail,
                    password
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erreur lors de la mise à jour de l\'email');
            }

            const data = await response.json();
            
            // Mettre à jour le token et les données utilisateur
            localStorage.setItem('accessToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            setAccessToken(data.token);
            setUser(data.user);
            
            return true;
        } catch (err) {
            console.error('Update email error:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async (currentPassword, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erreur lors de la mise à jour du mot de passe');
            }

            return true;
        } catch (err) {
            console.error('Update password error:', err);
            setError(err.message);
            return false;
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
            updateEmail,
            updatePassword,
            isAuthenticated,
            registerLogoutCallback
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 