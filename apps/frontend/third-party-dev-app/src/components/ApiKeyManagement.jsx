'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ApiKeyManagement() {
  const { user, getAuthToken } = useAuth();
  const [activeKey, setActiveKey] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [developerProfile, setDeveloperProfile] = useState(null);

  useEffect(() => {
    setIsClient(true);
    if (user) {
      fetchDeveloperProfile();
    }
  }, [user]);

  const fetchDeveloperProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      if (!process.env.NEXT_PUBLIC_THIRD_PARTY_API_URL) {
        throw new Error("L'URL de l'API des développeurs n'est pas configurée (NEXT_PUBLIC_THIRD_PARTY_API_URL)");
      }
      
      const apiUrl = `${process.env.NEXT_PUBLIC_THIRD_PARTY_API_URL}/api/developers/${user.id}`;
      console.log('Récupération du profil développeur depuis:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // Vérifier le type de contenu de la réponse
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur ${response.status}: Impossible de récupérer le profil développeur`);
        } else {
          const errorText = await response.text();
          throw new Error(`Erreur ${response.status}: ${errorText || 'Impossible de récupérer le profil développeur'}`);
        }
      }
      
      // Vérifier le type de contenu pour déterminer comment traiter la réponse
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setDeveloperProfile(data);
        if (data.apiKey) {
          setActiveKey({
            key: data.apiKey,
            createdAt: new Date(data.updatedAt || data.createdAt),
            isActive: true
          });
        }
      } else {
        console.warn("La réponse n'est pas au format JSON");
        throw new Error("La réponse du serveur n'est pas au format JSON valide");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const token = getAuthToken();
      if (!process.env.NEXT_PUBLIC_THIRD_PARTY_API_URL) {
        throw new Error("L'URL de l'API des développeurs n'est pas configurée (NEXT_PUBLIC_THIRD_PARTY_API_URL)");
      }
      
      const newKey = 'cesi_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      const apiUrl = `${process.env.NEXT_PUBLIC_THIRD_PARTY_API_URL}/api/developers/${user.id}`;
      console.log('Génération de clé API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: newKey,
          company: developerProfile?.company || '',
          position: developerProfile?.position || ''
        }),
      });
      
      if (!response.ok) {
        // Vérifier le type de contenu de la réponse
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur ${response.status}: Impossible de générer la clé API`);
        } else {
          const errorText = await response.text();
          throw new Error(`Erreur ${response.status}: ${errorText || 'Impossible de générer la clé API'}`);
        }
      }
      
      // Vérifier le type de contenu pour déterminer comment traiter la réponse
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setDeveloperProfile(prev => ({ ...prev, ...data, apiKey: newKey }));
      } else {
        console.warn("La réponse n'est pas au format JSON, mais la requête a réussi");
        setDeveloperProfile(prev => ({ ...prev, apiKey: newKey }));
      }
      
      setActiveKey({
        key: newKey,
        createdAt: new Date(),
        isActive: true
      });
      setSuccessMessage('Clé API générée avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération de la clé API:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const revokeKey = async () => {
    if (!user || !activeKey) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const token = getAuthToken();
      if (!process.env.NEXT_PUBLIC_THIRD_PARTY_API_URL) {
        throw new Error("L'URL de l'API des développeurs n'est pas configurée (NEXT_PUBLIC_THIRD_PARTY_API_URL)");
      }
      
      const apiUrl = `${process.env.NEXT_PUBLIC_THIRD_PARTY_API_URL}/api/developers/${user.id}`;
      console.log('Révocation de clé API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: null,
          company: developerProfile?.company || '',
          position: developerProfile?.position || ''
        }),
      });
      
      if (!response.ok) {
        // Vérifier le type de contenu de la réponse
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur ${response.status}: Impossible de révoquer la clé API`);
        } else {
          const errorText = await response.text();
          throw new Error(`Erreur ${response.status}: ${errorText || 'Impossible de révoquer la clé API'}`);
        }
      }
      
      // Traiter la réponse en fonction du type de contenu
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setDeveloperProfile(prev => ({ ...prev, ...data, apiKey: null }));
      } else {
        console.warn("La réponse n'est pas au format JSON, mais la requête a réussi");
        setDeveloperProfile(prev => ({ ...prev, apiKey: null }));
      }
      
      setActiveKey(null);
      setSuccessMessage('Clé API révoquée avec succès');
    } catch (error) {
      console.error('Erreur lors de la révocation de la clé API:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie :', err);
    }
  };

  if (!isClient) {
    return <div className="bg-white rounded-lg p-6">Chargement...</div>;
  }

  return (
    <section className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-[#030303] mb-4">Gestion des Clés API</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <div className="space-y-4">
        <p className="text-[#030303]/70">
          Gérez votre clé API pour accéder aux services de Cesi Eats. Assurez-vous de garder votre clé en sécurité.
        </p>

        {/* Clé active */}
        <div className="bg-[#EEEEEE] p-4 rounded-md">
          <h3 className="text-lg font-medium text-[#030303] mb-2">Clé API Actuelle</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              readOnly
              value={activeKey ? activeKey.key : '••••••••••••••••'}
              className="flex-1 bg-[#EEEEEE] text-[#030303]/70 px-3 py-2 rounded-md font-mono"
            />
            {activeKey && (
              <button 
                onClick={() => copyToClipboard(activeKey.key)}
                className="bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium min-w-[100px]"
                disabled={isLoading}
              >
                {copySuccess ? 'Copié !' : 'Copier'}
              </button>
            )}
          </div>
          {activeKey && (
            <div className="text-xs text-[#030303]/50 mt-2">
              Dernière mise à jour: {activeKey.createdAt.toLocaleDateString()} {activeKey.createdAt.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-4">
          {!activeKey ? (
            <button 
              onClick={generateApiKey}
              disabled={isLoading}
              className={`bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin inline -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération...
                </>
              ) : 'Générer Nouvelle Clé'}
            </button>
          ) : (
            <>
              <button 
                onClick={revokeKey}
                disabled={isLoading}
                className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Révocation...' : 'Révoquer Clé'}
              </button>
              <button 
                onClick={generateApiKey}
                disabled={isLoading}
                className={`bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Génération...' : 'Régénérer Clé'}
              </button>
            </>
          )}
        </div>
        
        <div className="mt-4 text-sm text-[#030303]/70 bg-blue-50 p-4 rounded-md">
          <p className="font-semibold mb-1">Comment utiliser votre clé API :</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Incluez votre clé API dans l'en-tête <code className="font-mono bg-blue-100 px-1 rounded">x-api-key</code> de vos requêtes HTTP</li>
            <li>Utilisez le format : <code className="font-mono bg-blue-100 px-1 rounded">x-api-key: votre_clé_api</code></li>
            <li>Cette clé vous donne accès à toutes les API de CES'EATS</li>
          </ol>
        </div>
      </div>
    </section>
  );
} 