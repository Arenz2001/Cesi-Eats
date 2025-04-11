'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

// Provider du contexte d'authentification
export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Routes qui ne nécessitent pas d'authentification
  const publicRoutes = ['/login', '/register', '/forgot-password'];

  // Fonction pour vérifier si un token est valide
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      // Vérifier si le token a expiré
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        return false;
      }
      
      // Vérifier si l'utilisateur a le rôle approprié (developper)
      return decoded.role === 'restaurant';
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return false;
    }
  };

  // Fonction pour récupérer le token d'authentification
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    return null;
  };

  // Fonction pour décoder le token et extraire les informations utilisateur
  const getUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        id_restaurant: decoded.id_restaurant || null,
      };
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  };

  // Fonction de connexion
  const login = async (email, password, rememberMe) => {
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }
      
      const token = data.token;
      
      // Vérifier si l'utilisateur a le rôle approprié
      const decodedToken = jwtDecode(token);
      if (decodedToken.role !== 'restaurant') {
        throw new Error('Accès refusé. Cette application est réservée aux restaurants.');
      }
      
      // Stocker le token selon l'option "Se souvenir de moi"
      if (rememberMe) {
        localStorage.setItem('auth_token', token);
      } else {
        sessionStorage.setItem('auth_token', token);
      }
      
      // Mettre à jour l'état de l'utilisateur
      const userData = getUserFromToken(token);
      setUser(userData);
      
      toast.success('Connexion réussie !');
      return { success: true, user: userData };
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Erreur lors de la connexion');
      return { success: false, error: error.message };
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    setUser(null);
    toast.success('Vous avez été déconnecté');
    router.push('/login');
  };

  // Vérification de l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      setLoading(true);
      
      // Récupérer le token
      const token = getAuthToken();
      
      // Vérifier si le token est valide
      if (isTokenValid(token)) {
        const userData = getUserFromToken(token);
        setUser(userData);
      } else {
        // Supprimer les tokens invalides
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        setUser(null);
        
        // Rediriger vers la page de connexion si la route actuelle n'est pas publique
        if (!publicRoutes.includes(pathname)) {
          router.push('/login');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [pathname, router]);

  // Gérer les changements de route pour la protection des pages
  useEffect(() => {
    // Si en cours de chargement, ne rien faire
    if (loading) return;
    
    // Si l'utilisateur n'est pas connecté et que la route actuelle n'est pas publique
    if (!user && !publicRoutes.includes(pathname)) {
      router.push('/login');
    }
  }, [user, pathname, loading, router]);

  // Valeur du contexte
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 