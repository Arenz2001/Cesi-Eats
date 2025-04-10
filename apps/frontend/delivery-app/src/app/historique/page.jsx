'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-hot-toast'
import { Truck, Calendar, User, DollarSign, MapPin } from 'lucide-react'

export default function HistoriqueLivraisons() {
    const [commandes, setCommandes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { accessToken, user } = useAuth()

    // Récupérer l'historique des commandes
    useEffect(() => {
        const fetchHistorique = async () => {
            if (!accessToken || !user?.id) return

            try {
                setLoading(true)
                setError(null)

                // Récupérer les commandes livrées par ce livreur
                const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération de l\'historique')
                }

                const allOrders = await response.json()
                console.log('Toutes les commandes:', allOrders)

                // Filtrer pour obtenir uniquement les commandes livrées par ce livreur
                const myDeliveredOrders = allOrders.filter(order => 
                    order.delivery_person_id === user.id && 
                    order.status === 'delivered'
                )

                console.log('Mes commandes livrées:', myDeliveredOrders)

                // Formater les commandes pour l'affichage
                const formattedOrders = myDeliveredOrders.map(order => ({
                    id: order._id,
                    orderId: order.order_id,
                    client: order.client_id || 'Client',
                    restaurant: order.restaurant_id || 'Restaurant',
                    adresse: order.delivery_address || 'Adresse de livraison',
                    montant: order.total_price || 0,
                    revenu: calculateRevenue(order.total_price),
                    deliveredAt: formatDate(order.updated_at),
                    rawDate: new Date(order.updated_at)
                }))

                // Trier par date (plus récent en premier)
                formattedOrders.sort((a, b) => b.rawDate - a.rawDate)
                
                setCommandes(formattedOrders)
            } catch (err) {
                console.error('Erreur de chargement de l\'historique:', err)
                setError(err.message)
                toast.error('Impossible de charger l\'historique des livraisons')
                setCommandes([])
            } finally {
                setLoading(false)
            }
        }

        fetchHistorique()
    }, [accessToken, user])

    // Fonction pour calculer le revenu du livreur
    function calculateRevenue(montant) {
        return montant ? Math.max(3, montant * 0.2).toFixed(2) : '3.00' 
    }

    // Fonction pour formater la date
    function formatDate(dateString) {
        const options = { 
            day: '2-digit', 
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
        return new Date(dateString).toLocaleString('fr-FR', options)
    }

    return (
        <div className="p-8 bg-[#f9f9f9] min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Historique des livraisons</h2>

            {loading && (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            )}

            {error && (
                <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {!loading && commandes.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 mb-4">Vous n'avez pas encore effectué de livraisons.</p>
                    <a href="/commandes-disponibles" 
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow transition">
                        Voir les commandes disponibles
                    </a>
                </div>
            )}

            {!loading && commandes.length > 0 && (
                <div className="space-y-4">
                    {commandes.map((commande) => (
                        <div
                            key={commande.id}
                            className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
                        >
                            <div className="flex flex-col md:flex-row justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Truck size={18} className="text-orange-500" />
                                        Commande #{commande.orderId || commande.id.slice(-5)}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                        <Calendar size={14} /> {commande.deliveredAt}
                                    </p>
                                </div>
                                <div className="mt-2 md:mt-0 text-right">
                                    <p className="text-sm font-medium text-gray-900">Montant: {commande.montant.toFixed(2)} €</p>
                                    <p className="text-sm text-green-600 font-medium">Rémunération: {commande.revenu} €</p>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-3 mt-3 text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                                <p className="flex items-center gap-2">
                                    <User size={16} className="text-gray-400" />
                                    <span>Client: {commande.client}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span>Adresse: {commande.adresse}</span>
                                </p>
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 bg-orange-50 rounded-lg p-4 border border-orange-100">
                        <h3 className="text-orange-800 font-medium flex items-center gap-2">
                            <DollarSign size={18} />
                            Récapitulatif des gains
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-gray-700">Nombre de livraisons:</p>
                            <p className="font-bold">{commandes.length}</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-gray-700">Gains totaux:</p>
                            <p className="font-bold">{commandes.reduce((total, cmd) => total + parseFloat(cmd.revenu), 0).toFixed(2)} €</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
