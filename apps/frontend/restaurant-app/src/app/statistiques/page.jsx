'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Données fictives pour les graphiques (remplacer par les données réelles plus tard)
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6666'];

export default function StatistiquesPage() {
    const { user, getAuthToken } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({
        totalCommandes: 0,
        commandesAujourdhui: 0,
        revenuTotal: 0,
        revenuAujourdhui: 0,
        commandesParStatut: [],
        ventesParJour: [],
        platsPopulaires: []
    })

    useEffect(() => {
        if (!user?.id_restaurant) return

        const fetchStats = async () => {
            try {
                setLoading(true)
                
                // Dans un cas réel, on ferait une requête API vers un endpoint qui retourne ces statistiques
                // Pour l'exemple, nous utilisons des données générées
                
                // Simulation de délai réseau
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                // Générer des données pour les 7 derniers jours
                const derniers7Jours = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() - (6 - i))
                    return date.toLocaleDateString('fr-FR', { weekday: 'short' })
                })
                
                const ventesParJour = derniers7Jours.map(jour => ({
                    jour,
                    ventes: Math.floor(Math.random() * 1000) + 200,
                    commandes: Math.floor(Math.random() * 20) + 5
                }))
                
                const commandesParStatut = [
                    { statut: 'Validées', nombre: Math.floor(Math.random() * 50) + 20 },
                    { statut: 'En préparation', nombre: Math.floor(Math.random() * 10) + 5 },
                    { statut: 'Prêtes', nombre: Math.floor(Math.random() * 8) + 3 },
                    { statut: 'En livraison', nombre: Math.floor(Math.random() * 12) + 8 },
                    { statut: 'Livrées', nombre: Math.floor(Math.random() * 100) + 50 },
                    { statut: 'Annulées', nombre: Math.floor(Math.random() * 5) + 1 }
                ]
                
                const platsPopulaires = [
                    { nom: 'Sushi Saumon', ventes: Math.floor(Math.random() * 100) + 50 },
                    { nom: 'Burger Classic', ventes: Math.floor(Math.random() * 100) + 40 },
                    { nom: 'Pizza Margherita', ventes: Math.floor(Math.random() * 100) + 30 },
                    { nom: 'Salade César', ventes: Math.floor(Math.random() * 100) + 20 },
                    { nom: 'Pâtes Carbonara', ventes: Math.floor(Math.random() * 100) + 10 }
                ].sort((a, b) => b.ventes - a.ventes)
                
                const totalCommandes = commandesParStatut.reduce((acc, curr) => acc + curr.nombre, 0)
                const revenuTotal = ventesParJour.reduce((acc, curr) => acc + curr.ventes, 0)
                
                setStats({
                    totalCommandes,
                    commandesAujourdhui: ventesParJour[ventesParJour.length - 1].commandes,
                    revenuTotal,
                    revenuAujourdhui: ventesParJour[ventesParJour.length - 1].ventes,
                    commandesParStatut,
                    ventesParJour,
                    platsPopulaires
                })
                
                setLoading(false)
            } catch (err) {
                console.error("Erreur lors du chargement des statistiques:", err)
                setError("Impossible de charger les statistiques")
                setLoading(false)
            }
        }

        fetchStats()
    }, [user])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#fff7ea]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 bg-[#fff7ea] min-h-screen">
                <div className="bg-red-100 p-4 rounded-md text-red-600">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 bg-[#fff7ea] min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Cartes de KPIs */}
                <div className="grid grid-cols-2 gap-6">
                    <KpiCard 
                        title="Commandes Totales" 
                        value={stats.totalCommandes} 
                        icon="📦" 
                        color="bg-blue-500"
                    />
                    <KpiCard 
                        title="Commandes Aujourd'hui" 
                        value={stats.commandesAujourdhui} 
                        icon="📅" 
                        color="bg-green-500"
                    />
                    <KpiCard 
                        title="Revenu Total" 
                        value={`${stats.revenuTotal.toLocaleString()} €`} 
                        icon="💰" 
                        color="bg-purple-500"
                    />
                    <KpiCard 
                        title="Revenu Aujourd'hui" 
                        value={`${stats.revenuAujourdhui.toLocaleString()} €`} 
                        icon="💵" 
                        color="bg-yellow-500"
                    />
                </div>

                {/* Camembert des statuts de commandes */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold mb-4">Répartition des commandes par statut</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.commandesParStatut}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="nombre"
                                    nameKey="statut"
                                >
                                    {stats.commandesParStatut.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} commandes`, 'Nombre']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Graphique des ventes sur 7 jours */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-lg font-bold mb-4">Évolution des ventes sur 7 jours</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={stats.ventesParJour}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="jour" />
                            <YAxis yAxisId="left" orientation="left" stroke="#FF8042" />
                            <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="ventes" name="Ventes (€)" fill="#FF8042" />
                            <Bar yAxisId="right" dataKey="commandes" name="Nombre de commandes" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Plats les plus populaires */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-bold mb-4">Plats les plus populaires</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={stats.platsPopulaires}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="nom" type="category" scale="band" width={150} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="ventes" name="Nombre de ventes" fill="#00C49F" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

// Composant pour les cartes de KPI
function KpiCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className={`${color} text-white p-3 rounded-full text-xl`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
