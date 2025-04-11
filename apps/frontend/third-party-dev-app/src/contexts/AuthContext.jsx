'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

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
  const [accessToken, setAccessToken] = useState(null);

  // Routes qui ne nécessitent pas d'authentification
  const publicRoutes = ['/login', '/register', '/forgot-password'];

  // Fonction pour vérifier si l'utilisateur est authentifié
  const isAuthenticated = () => {
    return !!user;
  };
  
  // Fonction pour récupérer le token d'authentification
  const getAuthToken = () => {
    return localStorage.getItem('accessToken');
  };

  // Fonction de connexion
  const login = async (email, password, rememberMe = false) => {
    setError(null);
    
    try {
      console.log('Tentative de connexion à:', `${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`);
      
      // Faire une vraie requête à l'API
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Identifiants invalides');
      }
      
      const data = await response.json();
      
      // Vérifier si l'utilisateur a le rôle approprié
      if (data.user && data.user.role !== 'developper') {
        throw new Error('Accès refusé. Cette application est réservée aux développeurs.');
      }
      
      // Stocker le token et les données utilisateur
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Mettre à jour l'état
      setAccessToken(data.token);
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
    setError(null);
    router.push('/login');
  };

  // Charger l'utilisateur depuis le localStorage
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
    accessToken,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 