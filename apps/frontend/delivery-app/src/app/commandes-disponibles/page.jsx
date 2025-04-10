'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, MapPin, Clock, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function CommandesDispoTable() {
    const [search, setSearch] = useState('')
    const [commandes, setCommandes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { accessToken } = useAuth()
    const router = useRouter()

    // Fonction pour charger les commandes disponibles
    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                setLoading(true)
                setError(null)
                
                // URL de la requête sans le préfixe /api
                const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/available`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des commandes')
                }

                const availableOrders = await response.json()
                console.log('Commandes disponibles pour livraison:', availableOrders)
                
                setCommandes(availableOrders)
            } catch (err) {
                console.error('Erreur de chargement des commandes:', err)
                setError('Impossible de charger les commandes. Veuillez réessayer.')
                
                // En mode développement, utiliser des données de test
                if (process.env.NODE_ENV === 'development') {
                    setCommandes([
                        { 
                            id: '67f6fa2e7fb286534c548e5',
                            orderId: 'ORD-1744312878882-699',
                            customer: { 
                                id: '67f8066be7b5f71f85c4a8ee', 
                                name: 'Alice Johnson' 
                            }, 
                            deliveryAddress: '123 Elm Street', 
                            restaurant: { 
                                id: '67f814c233181cb77f856c3e', 
                                name: 'Pizza Palace' 
                            },
                            status: 'accepted_by_restaurant',
                            totalPrice: 88.69,
                            createdAt: new Date().toISOString()
                        }
                    ])
                } else {
                    setCommandes([])
                }
            } finally {
                setLoading(false)
            }
        }

        if (accessToken) {
            fetchCommandes()
        }
    }, [accessToken])

    // Filtrer les commandes selon la recherche
    const filtered = commandes.filter(
        (cmd) =>
            (cmd.id?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (cmd.orderId?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (cmd.customer?.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (cmd.deliveryAddress?.toLowerCase() || '').includes(search.toLowerCase())
    )

    const handleValidate = async (id) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${id}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    deliveryPersonId: JSON.parse(localStorage.getItem('user')).id
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Erreur lors de la validation de la commande')
            }

            toast.success('Commande acceptée avec succès!')
            
            // Rafraîchir la liste des commandes
            const updatedCommandes = commandes.filter(cmd => cmd.id !== id)
            setCommandes(updatedCommandes)
            
            // Rediriger vers la page des commandes en cours
            router.push('/commandes-cours')
        } catch (err) {
            console.error('Erreur de validation:', err)
            toast.error(err.message || 'Échec de l\'acceptation de la commande')
        }
    }

    // Formater la date en français
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        }).format(date)
    }

    // Traduire les statuts en français
    const translateStatus = (status) => {
        const translations = {
            'validated_by_client': 'Validée par le client',
            'accepted_by_restaurant': 'Acceptée par le restaurant',
            'in_preparation': 'En préparation',
            'ready_for_delivery': 'Prête pour livraison',
            'accepted_by_delivery': 'Acceptée par le livreur',
            'on_the_way': 'En cours de livraison',
            'delivered': 'Livrée',
            'cancelled': 'Annulée'
        }
        return translations[status] || status
    }

    return (
        <div className="p-8 bg-[#f9f9f9] min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📦 Commandes disponibles</h2>

            {/* Recherche */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="🔍 Rechercher par client, adresse, numéro..."
                    className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {/* Loader */}
            {loading && (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            )}

            {/* Tableau */}
            {!loading && (
                <div className="overflow-auto">
                    <table className="w-full table-auto text-sm bg-white rounded-xl overflow-hidden shadow-md">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4 text-left">N°</th>
                                <th className="px-6 py-4 text-left">Client</th>
                                <th className="px-6 py-4 text-left">Restaurant</th>
                                <th className="px-6 py-4 text-left">Statut</th>
                                <th className="px-6 py-4 text-left">Prix</th>
                                <th className="px-6 py-4 text-left">Heure</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((cmd) => (
                                <tr
                                    key={cmd.id}
                                    className="border-t hover:bg-orange-50 transition duration-150"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">{cmd.orderId}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <User size={16} className="mr-2 text-gray-400" />
                                            {cmd.customer?.name || "Client inconnu"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{cmd.restaurant?.name || "Restaurant inconnu"}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
                                            {translateStatus(cmd.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        {cmd.totalPrice ? cmd.totalPrice.toFixed(2) : '0.00'} €
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <Clock size={16} className="mr-2 text-gray-400" />
                                            {formatDate(cmd.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleValidate(cmd.id)}
                                            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-full shadow-sm transition"
                                        >
                                            <CheckCircle size={16} /> Valider
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center p-6 text-gray-500 italic">
                                        Aucune commande trouvée...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
