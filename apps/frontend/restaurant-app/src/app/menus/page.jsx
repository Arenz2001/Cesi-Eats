'use client'

import { useRouter } from 'next/navigation'
import MenuCard from '@/components/MenuCard'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

// Données mockées pour les tests en dev, à supprimer en production
export const menusExemple = [
    {
        id: '1',
        name: 'Menu Spaghetti',
        description: 'Spaghetti bolognaise avec sauce tomate maison et parmesan.',
        price: 15.90,
        imageUrl: '/lasagnes.jpg',
    },
    {
        id: '2',
        name: 'Menu Salade César',
        description: 'Salade romaine, poulet grillé, croutons et sauce césar.',
        price: 12.50,
        imageUrl: '/lasagnes.jpg',
    },
    {
        id: '3',
        name: 'Menu Burger Classic',
        description: 'Burger avec steak haché, cheddar, salade, tomate et oignons.',
        price: 18.90,
        imageUrl: '/lasagnes.jpg',
    },
    {
        id: '4',
        name: 'Menu Vegan Bowl',
        description: 'Légumes rôtis, pois chiches, quinoa et sauce tahini.',
        price: 14.50,
        imageUrl: '/lasagnes.jpg',
    },
    {
        id: '5',
        name: 'Menu Tacos Poulet',
        description: '2 Tacos au poulet croustillant avec frites et boisson.',
        price: 16.90,
        imageUrl: '/lasagnes.jpg',
    },
    {
        id: '6',
        name: 'Menu Fish & Chips',
        description: 'Poisson pané avec frites maison et sauce tartare.',
        price: 17.90,
        imageUrl: '/lasagnes.jpg',
    },
]

export default function MenusPage() {
    const router = useRouter()
    const { user, getAuthToken } = useAuth()
    const [menus, setMenus] = useState([])
    const [menuToDelete, setMenuToDelete] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    // Récupérer les menus depuis l'API
    useEffect(() => {
        const fetchMenus = async () => {
            if (!user?.id) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                // Utiliser l'id_restaurant pour récupérer les menus
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
                // La réponse contient un objet avec dishes et menus, nous utilisons seulement les menus
                setMenus(data.menus || [])
            } catch (err) {
                console.error('Erreur lors du chargement des menus:', err)
                setError("Impossible de charger les menus. Veuillez réessayer plus tard.")
                // En cas d'erreur, on utilise les données d'exemple pour éviter un écran vide
                // setMenus(menusExemple) // Décommentez cette ligne pour utiliser les données d'exemple en cas d'erreur
            } finally {
                setIsLoading(false)
            }
        }

        fetchMenus()
    }, [user, getAuthToken])

    const handleEdit = (id) => {
        router.push(`/menus/edit/${id}`)
    }

    const handleAdd = () => {
        router.push('/menus/create')
    }

    const confirmDelete = async () => {
        if (!menuToDelete || !user?.id_restaurant) return

        try {
            setIsLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAURANT_API_URL}/${user.id_restaurant}/menus/${menuToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            })

            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`)
            }

            // Mise à jour de l'état local après suppression
            setMenus((prev) => prev.filter((menu) => menu._id !== menuToDelete))
            
            // Affichage d'un message de succès
            setSuccessMessage('Menu supprimé avec succès')
            
            // Effacer le message après 3 secondes
            setTimeout(() => {
                setSuccessMessage(null)
            }, 3000)
        } catch (err) {
            console.error('Erreur lors de la suppression:', err)
            setError("Impossible de supprimer le menu. Veuillez réessayer.")
        } finally {
            setIsLoading(false)
            setMenuToDelete(null)
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
                <h1 className="text-2xl font-bold text-gray-800">🍽️ Mes menus</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-full shadow-md transition duration-200"
                >
                    Ajouter un menu
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

            {menus.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center mt-12 p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Vous n'avez pas encore de menus</h2>
                        <p className="text-gray-500">Commencez par ajouter un premier menu</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-md transition duration-200"
                    >
                        Ajouter mon premier menu
                    </button>
                </div>
            ) : (
                <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {menus.map((menu) => (
                        <MenuCard
                            key={menu._id || menu.id}
                            title={menu.name}
                            description={menu.description || 'Aucune description'}
                            price={`${(menu.price || 0).toFixed(2)} €`}
                            image={menu.imageUrl || '/placeholder-food.jpg'}
                            onEdit={() => handleEdit(menu._id || menu.id)}
                            onDelete={() => setMenuToDelete(menu._id || menu.id)}
                        />
                    ))}
                </div>
            )}

            {/* Modale de confirmation */}
            {menuToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Supprimer ce menu ?
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Cette action est irréversible.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setMenuToDelete(null)}
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
