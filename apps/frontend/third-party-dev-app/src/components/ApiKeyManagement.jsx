'use client';

import { useState, useEffect } from 'react';

export default function ApiKeyManagement() {
  const [activeKey, setActiveKey] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateApiKey = () => {
    const newKey = 'cesi_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const keyObject = {
      id: Date.now(),
      key: newKey,
      createdAt: new Date(),
      isActive: true
    };
    setApiKeys(prev => [...prev, keyObject]);
    setActiveKey(keyObject);
  };

  const revokeKey = (keyId) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, isActive: false } : key
    ));
    if (activeKey?.id === keyId) {
      setActiveKey(null);
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
      <div className="space-y-4">
        <p className="text-[#030303]/70">
          Gérez vos clés API pour accéder aux services de Cesi Eats. Assurez-vous de garder vos clés en sécurité.
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
              >
                {copySuccess ? 'Copié !' : 'Copier'}
              </button>
            )}
          </div>
        </div>

        {/* Liste des clés */}
        {apiKeys.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-[#030303]">Historique des clés</h3>
            <div className="space-y-2">
              {apiKeys.map((key) => (
                <div key={key.id} className="bg-[#EEEEEE] p-4 rounded-md flex justify-between items-center">
                  <div>
                    <div className="font-mono text-sm text-[#030303]">
                      {key.key.substring(0, 12)}...
                    </div>
                    <div className="text-xs text-[#030303]/50">
                      Créée le {key.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      key.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {key.isActive ? 'Active' : 'Révoquée'}
                    </span>
                    {key.isActive && (
                      <button
                        onClick={() => revokeKey(key.id)}
                        className="bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Révoquer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4 pt-4">
          <button 
            onClick={generateApiKey}
            className="bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Générer Nouvelle Clé
          </button>
          {activeKey && (
            <button 
              onClick={() => revokeKey(activeKey.id)}
              className="bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Révoquer Clé Active
            </button>
          )}
        </div>
      </div>
    </section>
  );
} 