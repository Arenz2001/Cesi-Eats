'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toast, Toaster } from 'react-hot-toast'

export default function Commandes() {
    const { user, getAuthToken } = useAuth()
    const [commandesEnAttente, setCommandesEnAttente] = useState([])
    const [commandesEnCours, setCommandesEnCours] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user) return

        const fetchOrders = async () => {
            try {
                setLoading(true)
                // Vérifier que l'id_restaurant est disponible
                if (!user.id_restaurant) {
                    throw new Error("ID du restaurant non disponible")
                }
                
                // Utiliser la route correcte pour obtenir les commandes d'un restaurant spécifique
                const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/restaurant/${user.id_restaurant}`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                })
                
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des commandes')
                }
                
                const data = await response.json()
                
                // Filtrer les commandes en attente (validated_by_client)
                const enAttente = data.filter(order => order.status === 'validated_by_client')
                
                // Filtrer les commandes en cours (accepted_by_restaurant, in_preparation)
                const enCours = data.filter(order => 
                    order.status === 'accepted_by_restaurant' || 
                    order.status === 'in_preparation'
                )
                
                setCommandesEnAttente(enAttente)
                setCommandesEnCours(enCours)
                setLoading(false)
            } catch (err) {
                console.error('Erreur lors du chargement des commandes:', err)
                setError(err.message)
                setLoading(false)
            }
        }
        
        fetchOrders()
        
        // Rafraîchir les commandes toutes les 30 secondes
        const interval = setInterval(fetchOrders, 30000)
        
        return () => clearInterval(interval)
    }, [user, getAuthToken])

    const handleAcceptOrder = async (orderId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    status: 'accepted_by_restaurant'
                })
            })
            
            if (!response.ok) {
                throw new Error('Erreur lors de l\'acceptation de la commande')
            }
            
            // Mettre à jour l'état local pour refléter le changement
            const updatedOrder = await response.json()
            
            // Retirer la commande des commandes en attente
            setCommandesEnAttente(prev => prev.filter(cmd => cmd._id !== orderId))
            
            // Ajouter la commande aux commandes en cours
            setCommandesEnCours(prev => [...prev, updatedOrder])
            
            toast.success(`Commande ${updatedOrder.order_id} acceptée avec succès`)
        } catch (err) {
            console.error('Erreur lors de l\'acceptation de la commande:', err)
            toast.error(err.message)
        }
    }

    const handleRejectOrder = async (orderId) => {
        if (!confirm('Êtes-vous sûr de vouloir refuser cette commande ?')) {
            return
        }
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    status: 'cancelled'
                })
            })
            
            if (!response.ok) {
                throw new Error('Erreur lors du refus de la commande')
            }
            
            // Retirer la commande des commandes en attente
            setCommandesEnAttente(prev => prev.filter(cmd => cmd._id !== orderId))
            
            toast.success('Commande refusée')
        } catch (err) {
            console.error('Erreur lors du refus de la commande:', err)
            toast.error(err.message)
        }
    }

    const handleStartPreparation = async (orderId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    status: 'in_preparation'
                })
            })
            
            if (!response.ok) {
                throw new Error('Erreur lors du changement de statut de la commande')
            }
            
            // Mettre à jour l'état local
            setCommandesEnCours(prev => 
                prev.map(cmd => 
                    cmd._id === orderId 
                        ? { ...cmd, status: 'in_preparation' } 
                        : cmd
                )
            )
            
            toast.success('Commande en préparation')
        } catch (err) {
            console.error('Erreur lors du changement de statut:', err)
            toast.error(err.message)
        }
    }

    const handleReadyForDelivery = async (orderId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    status: 'ready_for_delivery'
                })
            })
            
            if (!response.ok) {
                throw new Error('Erreur lors du changement de statut de la commande')
            }
            
            // Retirer la commande des commandes en cours
            setCommandesEnCours(prev => prev.filter(cmd => cmd._id !== orderId))
            
            toast.success('Commande prête pour la livraison')
        } catch (err) {
            console.error('Erreur lors du changement de statut:', err)
            toast.error(err.message)
        }
    }

    // Formater la date pour l'affichage
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Calculer le temps écoulé depuis la création de la commande
    const getTimeElapsed = (dateString) => {
        const created = new Date(dateString)
        const now = new Date()
        const diffMs = now - created
        const diffMins = Math.floor(diffMs / 60000)
        
        if (diffMins < 60) {
            return `Il y a ${diffMins} min`
        } else {
            const hours = Math.floor(diffMins / 60)
            const mins = diffMins % 60
            return `Il y a ${hours}h${mins ? ` ${mins}min` : ''}`
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#fff7ea]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#fff7ea]">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <h2 className="text-lg font-bold text-red-600 mb-2">Erreur</h2>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        )
    }

    // Si aucune commande n'est disponible (ni en attente, ni en cours)
    if (commandesEnAttente.length === 0 && commandesEnCours.length === 0) {
        return (
            <div className="p-8 bg-[#fff7ea] min-h-screen">
                <Toaster position="top-center" />
                <h1 className="text-2xl font-bold mb-6">Gestion des commandes</h1>
                
                <div className="bg-white p-8 rounded-2xl shadow-md text-center">
                    <div className="text-4xl mb-4">📭</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Pas de commandes disponibles</h2>
                    <p className="text-gray-600 mb-4">
                        Vous n'avez pas de commandes en attente ou en cours pour le moment.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Les nouvelles commandes apparaîtront ici automatiquement.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 bg-[#fff7ea] min-h-screen">
            <Toaster position="top-center" />
            <h1 className="text-2xl font-bold mb-6">Gestion des commandes</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <CommandeTableBlock
                    title="📥 Commandes en attente"
                    commandes={commandesEnAttente.map(order => ({
                        id: order._id,
                        orderId: order.order_id,
                        info: getTimeElapsed(order.created_at),
                        date: formatDate(order.created_at),
                        items: order.items,
                        totalPrice: order.total_price,
                        clientId: order.client_id,
                        status: order.status
                    }))}
                    actionLabel="Accepter"
                    secondaryAction={{
                        label: "Refuser",
                        color: "bg-red-500"
                    }}
                    actionColor="bg-green-500"
                    onAction={handleAcceptOrder}
                    onSecondaryAction={handleRejectOrder}
                />

                <CommandeTableBlock
                    title="🚚 Commandes en cours"
                    commandes={commandesEnCours.map(order => ({
                        id: order._id,
                        orderId: order.order_id,
                        info: order.status === 'accepted_by_restaurant' 
                            ? 'En attente de préparation' 
                            : 'En préparation',
                        date: formatDate(order.created_at),
                        items: order.items,
                        totalPrice: order.total_price,
                        clientId: order.client_id,
                        status: order.status
                    }))}
                    actionLabel={cmd => cmd.status === 'accepted_by_restaurant' ? "Commencer préparation" : "Prêt pour livraison"}
                    actionColor="bg-orange-500"
                    onAction={(id) => {
                        const order = commandesEnCours.find(o => o._id === id);
                        if (order.status === 'accepted_by_restaurant') {
                            handleStartPreparation(id);
                        } else {
                            handleReadyForDelivery(id);
                        }
                    }}
                />
            </div>
        </div>
    )
}

function CommandeTableBlock({ title, commandes, actionLabel, secondaryAction, actionColor, onAction, onSecondaryAction }) {
    const [expandedOrder, setExpandedOrder] = useState(null)
    
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
            <div className="overflow-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-4 py-2">Commande</th>
                            <th className="px-4 py-2">Statut</th>
                            <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commandes.map((cmd) => (
                            <React.Fragment key={cmd.id}>
                                <tr className="border-b hover:bg-orange-50 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === cmd.id ? null : cmd.id)}>
                                    <td className="px-4 py-3 font-medium">{cmd.orderId}</td>
                                    <td className="px-4 py-3">{cmd.info}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onAction(cmd.id);
                                            }}
                                            className={`text-white px-4 py-1 rounded-full text-sm ${typeof actionLabel === 'function' ? actionColor : actionColor} hover:brightness-110 transition`}
                                        >
                                            {typeof actionLabel === 'function' ? actionLabel(cmd) : actionLabel}
                                        </button>
                                        {secondaryAction && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSecondaryAction(cmd.id);
                                                }}
                                                className={`ml-2 text-white px-4 py-1 rounded-full text-sm ${secondaryAction.color} hover:brightness-110 transition`}
                                            >
                                                {secondaryAction.label}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {expandedOrder === cmd.id && (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-3 bg-gray-50">
                                            <div className="space-y-3">
                                                <p className="text-sm"><span className="font-medium">Date:</span> {cmd.date}</p>
                                                <p className="text-sm"><span className="font-medium">Client ID:</span> {cmd.clientId}</p>
                                                <p className="text-sm font-medium mb-2">Articles:</p>
                                                <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
                                                    {cmd.items.map((item, index) => (
                                                        <li key={index} className="flex justify-between">
                                                            <span>
                                                                <span className="font-medium">{item.quantity}x</span> {item.dish_id || "Plat inconnu"}
                                                            </span>
                                                            <span className="font-medium text-orange-600">
                                                                {(item.price * item.quantity).toFixed(2)}€
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="text-sm font-medium">Total: {cmd.totalPrice.toFixed(2)}€</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {commandes.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-4 py-3 text-center text-gray-400 italic">
                                    Aucune commande
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
