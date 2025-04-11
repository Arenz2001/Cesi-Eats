"use client"
import { useState, useEffect } from 'react'
import CommandeEnCours from '@/components/CommandeEnCours'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-hot-toast'

export default function Page() {
    const [commande, setCommande] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { accessToken, user } = useAuth()

    // Récupérer les commandes en cours du livreur
    useEffect(() => {
        const fetchCommandes = async () => {
            if (!accessToken || !user?.id) return

            try {
                setLoading(true)
                setError(null)

                // Récupérer les commandes du livreur
                const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des commandes')
                }

                const allOrders = await response.json()
                console.log('Toutes les commandes:', allOrders)

                // Filtrer pour obtenir uniquement les commandes en cours du livreur actuel
                const myActiveOrders = allOrders.filter(order => 
                    order.delivery_person_id === user.id && 
                    (order.status === 'accepted_by_delivery' || order.status === 'on_the_way')
                )

                console.log('Mes commandes en cours:', myActiveOrders)

                // S'il y a des commandes, prendre la première
                if (myActiveOrders.length > 0) {
                    const activeOrder = myActiveOrders[0]
                    setCommande({
                        id: activeOrder.order_id,
                        _id: activeOrder._id,
                        status: translateStatus(activeOrder.status),
                        eta: calculateETA(activeOrder.created_at),
                        restaurant: activeOrder.restaurant_id || 'Restaurant', // À remplacer par le nom réel
                        restaurantAdresse: 'Adresse du restaurant', // À récupérer depuis l'API
                        items: formatItems(activeOrder.items),
                        total: activeOrder.total_price,
                        revenu: calculateRevenue(activeOrder.total_price),
                        bonus: '0€',
                        mapImage: '/images/map.png',
                        client: {
                            nom: activeOrder.client_id || 'Client',
                            adresse: activeOrder.delivery_address || 'Adresse de livraison',
                            tel: '06 12 34 56 78', // À récupérer depuis l'API
                        }
                    })
                } else {
                    // Si pas de commande en cours, utiliser les données de test
                    setCommande(null)
                }
            } catch (err) {
                console.error('Erreur de chargement des commandes:', err)
                setError(err.message)
                toast.error('Impossible de charger la commande en cours')
            } finally {
                setLoading(false)
            }
        }

        fetchCommandes()
    }, [accessToken, user])

    // Fonction pour mettre à jour le statut de la commande
    const handleUpdateStatus = async () => {
        if (!commande?._id) return
        
        try {
            const newStatus = commande.status === 'Acceptée par le livreur' ? 'on_the_way' : 'delivered'
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${commande._id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Erreur lors de la mise à jour du statut')
            }

            toast.success(`Statut mis à jour avec succès! La commande est ${newStatus === 'on_the_way' ? 'en cours de livraison' : 'livrée'}`)
            
            // Si la commande est livrée, rediriger vers la page des commandes disponibles
            if (newStatus === 'delivered') {
                // window.location.href = '/commandes-disponibles'
                setCommande(null)
            } else {
                // Mettre à jour le statut local
                setCommande({
                    ...commande,
                    status: translateStatus(newStatus)
                })
            }
        } catch (err) {
            console.error('Erreur de mise à jour du statut:', err)
            toast.error(err.message || 'Échec de la mise à jour du statut')
        }
    }

    // Si pas de commande active, afficher un message
    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (!commande) {
        return (
            <div className="p-8 bg-[#f9f9f9] min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">🚚 Commande en cours</h2>
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center py-16">
                        <p className="text-lg text-gray-600 mb-4">Vous n'avez aucune commande en cours.</p>
                        <a href="/commandes-disponibles" 
                            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow transition">
                            Voir les commandes disponibles
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return <CommandeEnCours commande={commande} onUpdateStatus={handleUpdateStatus} />
}

// Fonction pour calculer le temps estimé de livraison
function calculateETA(createdAt) {
    const created = new Date(createdAt)
    const now = new Date()
    const diffMinutes = Math.round((now - created) / (1000 * 60))
    
    // Supposons qu'une commande prend environ 30 minutes à livrer
    const remainingMinutes = 30 - diffMinutes
    return remainingMinutes > 0 ? `${remainingMinutes} min` : 'Imminent'
}

// Fonction pour calculer la rémunération du livreur
function calculateRevenue(total) {
    // Par exemple, 20% du montant total avec un minimum de 3€
    const revenue = Math.max(3, total * 0.2)
    return revenue.toFixed(2)
}

// Fonction pour formater les éléments de la commande
function formatItems(items) {
    if (!items || !items.length) return 'Pas d\'articles'
    
    return items.map(item => `${item.quantity}x ${item.dish_id || 'Article'}`).join(', ')
}

// Traduire les statuts en français
function translateStatus(status) {
    const translations = {
        'validated_by_client': 'Validée par le client',
        'accepted_by_restaurant': 'Acceptée par le restaurant',
        'in_preparation': 'En préparation',
        'accepted_by_delivery': 'Acceptée par le livreur',
        'on_the_way': 'En cours de livraison',
        'delivered': 'Livrée',
        'cancelled': 'Annulée'
    }
    return translations[status] || status
}
