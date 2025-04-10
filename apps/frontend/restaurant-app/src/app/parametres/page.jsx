'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function RestaurateurParametres() {
    const { user, getAuthToken } = useAuth()
    const [restaurant, setRestaurant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchRestaurantInfo = async () => {
            if (!user?.id_restaurant) {
                setLoading(false)
                setError("ID du restaurant non disponible")
                return
            }

            try {
                setLoading(true)
                const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAURANT_API_URL}/${user.id_restaurant}`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                })

                if (!response.ok) {
                    throw new Error(`Erreur: ${response.status}`)
                }

                const data = await response.json()
                setRestaurant(data)
            } catch (err) {
                console.error('Erreur lors du chargement des informations du restaurant:', err)
                setError("Impossible de charger les informations du restaurant.")
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurantInfo()
    }, [user, getAuthToken])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#fff7ea]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-[#f9f9f9] min-h-screen px-6 py-12 w-full">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 p-4 rounded-md text-red-600 mb-6">
                        {error}
                    </div>
                    <Link
                        href="/"
                        className="text-orange-500 hover:text-orange-600"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        )
    }

    if (!restaurant) {
        return (
            <div className="bg-[#f9f9f9] min-h-screen px-6 py-12 w-full">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-yellow-100 p-4 rounded-md text-yellow-600 mb-6">
                        Aucune information disponible pour ce restaurant.
                    </div>
                    <Link
                        href="/"
                        className="text-orange-500 hover:text-orange-600"
                    >
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        )
    }

    // Formater correctement les données pour l'affichage
    const formattedRestaurant = {
        nom: restaurant.name || 'N/A',
        email: user.email || 'N/A',
        adresse: {
            rue: restaurant.address?.street || 'N/A',
            ville: restaurant.address?.city || 'N/A',
            codePostal: restaurant.address?.postalCode || 'N/A',
            pays: restaurant.address?.country || 'France',
        },
        description: restaurant.description || 'Aucune description disponible',
        cuisineType: restaurant.cuisineType || 'N/A',
        // Les horaires sont fictifs pour l'instant car elles ne sont pas dans l'API
        horaires: [
            { jour: 'Lundi - Vendredi', plages: ['11:00 - 14:00', '18:00 - 22:00'] },
            { jour: 'Samedi', plages: ['11:00 - 23:00'] },
            { jour: 'Dimanche', plages: ['11:00 - 21:00'] },
        ],
    }

    return (
        <div className="bg-[#f9f9f9] min-h-screen px-6 py-12 w-full">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header + bouton modifier */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">🏪 Paramètres du restaurant</h1>
                    <Link
                        href="/parametres/edit"
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-full transition shadow"
                    >
                        Modifier
                    </Link>
                </div>

                {/* Infos générales */}
                <Card title="📄 Informations générales">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Info label="Nom" value={formattedRestaurant.nom} />
                        <Info label="Email" value={formattedRestaurant.email} />
                        <Info label="Type de cuisine" value={formattedRestaurant.cuisineType} />
                    </div>
                    <div className="mt-6">
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="text-base text-gray-800 mt-1">{formattedRestaurant.description}</p>
                    </div>
                </Card>

                {/* Adresse */}
                <Card title="📍 Adresse">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Info label="Rue" value={formattedRestaurant.adresse.rue} />
                        <Info label="Ville" value={formattedRestaurant.adresse.ville} />
                        <Info label="Code Postal" value={formattedRestaurant.adresse.codePostal} />
                        <Info label="Pays" value={formattedRestaurant.adresse.pays} />
                    </div>
                </Card>

                {/* Horaires */}
                <Card title="⏰ Heures d'ouverture">
                    <div className="space-y-4">
                        {formattedRestaurant.horaires.map((jour, i) => (
                            <div key={i}>
                                <p className="font-semibold text-gray-800">{jour.jour}</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {jour.plages.map((plage, j) => (
                                        <span
                                            key={j}
                                            className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            {plage}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

function Card({ title, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
            {children}
        </div>
    )
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-base font-medium text-gray-800 mt-1">{value}</p>
        </div>
    )
}
