"use client";

import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import StatsCard from '@/components/StatsCard';

export default function TableauDeBord() {
  const [dashboardData, setDashboardData] = useState({
    commandesPassees: [],
    livraisonsAcceptees: [],
    commandesAcceptees: [],
    livraisonsTerminees: [],
    statistiques: {}
  });
  const [loading, setLoading] = useState(true);
  
  // Charger les données depuis l'API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données du tableau de bord');
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DashboardCard 
          title="Commandes passées" 
          items={dashboardData.commandesPassees} 
        />
        <DashboardCard 
          title="livraisons acceptée" 
          items={dashboardData.livraisonsAcceptees} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DashboardCard 
          title="Commandes acceptées" 
          items={dashboardData.commandesAcceptees} 
        />
        <DashboardCard 
          title="Livraisons terminée" 
          items={dashboardData.livraisonsTerminees} 
        />
      </div>
      
      <div className="mt-8">
        <StatsCard 
          title="Chiffre d'affaire en transaction" 
          stats={dashboardData.statistiques} 
        />
      </div>
    </div>
  );
} 