'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FaBook, FaCode, FaGithub, FaFileAlt } from 'react-icons/fa';

export default function Documentation() {
  const [isClient, setIsClient] = useState(false);
  
  // Définir manuellement les APIs disponibles avec leurs descriptions
  const apiDocs = [
    {
      name: 'AUTH',
      title: 'API d\'authentification',
      description: 'Gestion des comptes utilisateurs, authentification et autorisations.',
      baseUrl: process.env.NEXT_PUBLIC_AUTH_API_URL,
      color: 'bg-blue-600',
      icon: '🔐'
    },
    {
      name: 'CUSTOMER',
      title: 'API de clients',
      description: 'Gestion des clients, préférences et profils utilisateurs.',
      baseUrl: process.env.NEXT_PUBLIC_CUSTOMER_API_URL,
      color: 'bg-green-600',
      icon: '👥'
    },
    {
      name: 'RESTAURANT',
      title: 'API de restaurants',
      description: 'Gestion des restaurants, menus et disponibilités.',
      baseUrl: process.env.NEXT_PUBLIC_RESTAURANT_API_URL,
      color: 'bg-red-600',
      icon: '🍽️'
    },
    {
      name: 'ORDER',
      title: 'API de commandes',
      description: 'Gestion des commandes, suivi et historique.',
      baseUrl: process.env.NEXT_PUBLIC_ORDER_API_URL,
      color: 'bg-purple-600',
      icon: '📋'
    },
    {
      name: 'DELIVERY',
      title: 'API de livraison',
      description: 'Gestion des livraisons, livreurs et suivi en temps réel.',
      baseUrl: process.env.NEXT_PUBLIC_DELIVERY_API_URL,
      color: 'bg-yellow-600',
      icon: '🚚'
    },
    {
      name: 'THIRD_PARTY',
      title: 'API de développement',
      description: 'Services pour intégrations tierces et développement d\'applications.',
      baseUrl: process.env.NEXT_PUBLIC_THIRD_PARTY_API_URL,
      color: 'bg-[#EF8732]',
      icon: '💻'
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div className="container mx-auto py-8 px-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-[#030303]">Documentation des APIs</h1>
      <p className="text-gray-600 mb-8">Accédez à la documentation des différentes APIs de la plateforme CES'EATS</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiDocs.map((api) => (
          <div key={api.name} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className={`${api.color} px-6 py-4 flex items-center`}>
              <span className="text-2xl mr-2">{api.icon}</span>
              <h2 className="text-xl font-semibold text-white">{api.title}</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                {api.description}
              </p>
              <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-100 p-2 rounded overflow-auto">
                {api.baseUrl}
              </p>
              <div className="space-y-2">
                <a 
                  href={`${api.baseUrl}/api-docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-2 px-4 bg-[#EF8732] text-white rounded-md hover:bg-[#EF8732]/90 transition-colors"
                >
                  <FaFileAlt className="mr-2" />
                  Documentation Swagger
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
        
        {/* Guide d'utilisation */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="bg-indigo-600 px-6 py-4 flex items-center">
            <span className="text-2xl mr-2">📚</span>
            <h2 className="text-xl font-semibold text-white">Guide d'utilisation</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Guide pour les développeurs intégrant les services CES'EATS.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">Utilisation de votre clé API</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-1">
                  <li>Incluez votre clé dans l'en-tête <code className="font-mono bg-gray-100 p-1 rounded">x-api-key</code></li>
                  <li>Toutes les requêtes doivent être authentifiées</li>
                  <li>Les réponses sont au format JSON</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Environnements disponibles</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environnement</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">Production</td>
                        <td className="px-4 py-2 text-sm font-mono text-gray-500">https://api-cesieats.arenz-proxmox.fr</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm text-gray-900">Développement</td>
                        <td className="px-4 py-2 text-sm font-mono text-gray-500">http://localhost:3006</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ressources de développement */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="bg-gray-800 px-6 py-4 flex items-center">
            <span className="text-2xl mr-2">🛠️</span>
            <h2 className="text-xl font-semibold text-white">Ressources</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Ressources et outils supplémentaires pour développeurs.
            </p>
            <div className="space-y-3">
              <a 
                href="https://github.com/Arenz2001/Cesi-Eats"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              >
                <FaGithub className="mr-2" />
                Dépôt GitHub
              </a>
              <a 
                href="https://www.postman.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                <FaCode className="mr-2" />
                Collection Postman
              </a>
              <a 
                href="#"
                className="flex items-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaBook className="mr-2" />
                Guide de démarrage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 