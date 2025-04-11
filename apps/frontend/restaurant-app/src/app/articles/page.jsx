'use client'

import { useRouter } from 'next/navigation'
import MenuCard from '@/components/MenuCard'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

// Données mockées pour les tests en dev, à supprimer en production
export const platsExemple = [
    {
        id: '1',
        name: 'Spaghetti Bolognaise',
        description: 'Spaghetti bolognaise avec sauce tomate maison et parmesan.',
        price: 12.90,
        category: 'Plat principal',
        image: '/lasagnes.jpg',
    },
    {
        id: '2',
        name: 'Salade César',
        description: 'Salade romaine, poulet grillé, croutons et sauce césar.',
        price: 9.50,
        category: 'Entrée',
        image: '/lasagnes.jpg',
    },
    {
        id: '3',
        name: 'Burger Classic',
        description: 'Burger avec steak haché, cheddar, salade, tomate et oignons.',
        price: 14.90,
        category: 'Plat principal',
        image: '/lasagnes.jpg',
    },
    {
        id: '4',
        name: 'Vegan Bowl',
        description: 'Légumes rôtis, pois chiches, quinoa et sauce tahini.',
        price: 11.50,
        category: 'Plat principal',
        image: '/lasagnes.jpg',
    },
    {
        id: '5',
        name: 'Tacos Poulet',
        description: '2 Tacos au poulet croustillant avec frites et boisson.',
        price: 13.90,
        category: 'Plat principal',
        image: '/lasagnes.jpg',
    },
    {
        id: '6',
        name: 'Fish & Chips',
        description: 'Poisson pané avec frites maison et sauce tartare.',
        price: 15.90,
        category: 'Plat principal',
        image: '/lasagnes.jpg',
    },
]

export default function PlatsPage() {
    const router = useRouter()
    const { user, getAuthToken } = useAuth()
    const [plats, setPlats] = useState([])
    const [platToDelete, setPlatToDelete] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    // Récupérer les plats depuis l'API
    useEffect(() => {
        const fetchPlats = async () => {
            if (!user?.id) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                // Utiliser l'id_restaurant pour récupérer les plats
                const restaurantId = user.id_restaurant
                
                if (!restaurantId) {
                    throw new Error("ID du restaurant non disponible")
                }
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAURANT_API_URL}/${restaurantId}/menu`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                })

                if (!response.ok) {
                    throw new Error(`Erreur: ${response.status}`)
                }

                const data = await response.json()
                // La réponse contient un objet avec dishes et menus, nous utilisons seulement les dishes
                setPlats(data.dishes || [])
            } catch (err) {
                console.error('Erreur lors du chargement des plats:', err)
                setError("Impossible de charger les plats. Veuillez réessayer plus tard.")
                // En cas d'erreur, on utilise les données d'exemple pour éviter un écran vide
                // setPlats(platsExemple) // Décommentez cette ligne pour utiliser les données d'exemple en cas d'erreur
            } finally {
                setIsLoading(false)
            }
        }

        fetchPlats()
    }, [user, getAuthToken])

    const handleEdit = (id) => {
        router.push(`/articles/edit/${id}`)
    }

    const handleAdd = () => {
        router.push('/articles/create')
    }

    const confirmDelete = async () => {
        if (!platToDelete || !user?.id_restaurant) return

        try {
            setIsLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAURANT_API_URL}/${user.id_restaurant}/dishes/${platToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            })

            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`)
            }

            // Mise à jour de l'état local après suppression
            setPlats((prev) => prev.filter((plat) => plat._id !== platToDelete))
            
            // Affichage d'un message de succès
            setSuccessMessage('Plat supprimé avec succès')
            
            // Effacer le message après 3 secondes
            setTimeout(() => {
                setSuccessMessage(null)
            }, 3000)
        } catch (err) {
            console.error('Erreur lors de la suppression:', err)
            setError("Impossible de supprimer le plat. Veuillez réessayer.")
        } finally {
            setIsLoading(false)
            setPlatToDelete(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#fff7ea]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    return (
        <div className="bg-[#fff7ea] min-h-screen">
            <div className="flex justify-between items-center px-6 pt-8 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">🍕 Mes plats</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-full shadow-md transition duration-200"
                >
                    Ajouter un plat
                </button>
            </div>

            {error && (
                <div className="mx-6 mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mx-6 mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
                    {successMessage}
                </div>
            )}

            {plats.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center mt-12 p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Vous n'avez pas encore de plats</h2>
                        <p className="text-gray-500">Commencez par ajouter un premier plat à votre menu</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-md transition duration-200"
                    >
                        Ajouter mon premier plat
                    </button>
                </div>
            ) : (
                <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {plats.map((plat) => (
                        <MenuCard
                            key={plat._id || plat.id}
                            title={plat.name}
                            description={plat.description || 'Aucune description'}
                            price={`${(plat.price || 0).toFixed(2)} €`}
                            category={plat.category || 'Non catégorisé'}
                            image={plat.imageUrl || '/placeholder-food.jpg'}
                            onEdit={() => handleEdit(plat._id || plat.id)}
                            onDelete={() => setPlatToDelete(plat._id || plat.id)}
                        />
                    ))}
                </div>
            )}

            {/* Modale de confirmation */}
            {platToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Supprimer ce plat ?
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Cette action est irréversible.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setPlatToDelete(null)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
