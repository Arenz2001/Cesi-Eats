'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useCart } from '@/context/CartContext';
import Toast from '@/components/Toast';

export default function DishListing() {
    const [dishes, setDishes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [showToast, setShowToast] = useState(false)

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const response = await fetch('http://localhost:3002/')
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des restaurants")
                }

                const restaurants = await response.json()
                
                // Extraire tous les plats de tous les restaurants
                const allDishes = []
                restaurants.forEach(restaurant => {
                    if (restaurant.dishes && restaurant.dishes.length > 0) {
                        restaurant.dishes.forEach(dish => {
                            allDishes.push({
                                id: dish._id,
                                name: dish.name,
                                desc: dish.description || 'Plat délicieux',
                                price: dish.price.toFixed(2),
                                imageUrl: dish.imageUrl || '/lasagnes.jpg',
                                quantity: 0,
                                restaurantId: restaurant._id,
                                restaurantName: restaurant.name
                            })
                        })
                    }
                })
                
                setDishes(allDishes)
                setLoading(false)
            } catch (err) {
                console.error("Erreur lors du chargement des plats:", err)
                setError(err.message)
                setLoading(false)
            }
        }

        fetchDishes()
    }, [])

    const handleShowToast = () => {
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    const filteredDishes = dishes.filter((dish) =>
        dish.name.toLowerCase().includes(search.toLowerCase()) ||
        dish.desc.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="px-6 py-24 bg-[#f9f9f9] min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="px-6 py-24 bg-[#f9f9f9] min-h-screen flex justify-center items-center">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    <p className="font-bold">Erreur de chargement</p>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="px-6 py-24 bg-[#f9f9f9] min-h-screen">
            {/* Barre de recherche */}
            <div className="flex justify-center mb-10">
                <div className="relative w-full max-w-xl">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un plat..."
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            {/* Liste des plats */}
            {filteredDishes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredDishes.map((dish) => (
                        <DishCard key={dish.id} dish={dish} onAdd={handleShowToast} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-20">Aucun plat ne correspond à votre recherche.</p>
            )}
            {showToast && <Toast message="✅ Article ajouté au panier" onClose={() => setShowToast(false)} />}

        </div>
    )
}

// Composant carte de plat
function DishCard({ dish, onAdd }) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        console.log("added to cart", dish)
        addToCart(dish);
        onAdd()
    }

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
            <div className="h-40 relative">
                <img src={dish.imageUrl} alt={dish.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-800">{dish.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{dish.desc}</p>
                <p className="text-xs text-orange-500 mb-2">De {dish.restaurantName}</p>
                <p className="text-orange-500 font-semibold mb-4">{dish.price} €</p>
                <div className="mt-auto flex flex-col sm:flex-row justify-between items-center gap-2">
                    <button
                        onClick={handleAddToCart}
                        className="w-full sm:w-auto text-sm bg-green-500 hover:bg-green-600 cursor-pointer text-white px-4 py-1 rounded-full transition"
                    >
                        Ajouter au panier
                    </button>
                    <button
                        className="w-full sm:w-auto text-sm bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-4 py-1 rounded-full transition"
                        onClick={() => window.location.href = `/restaurant/${dish.restaurantId}`}
                    >
                        Voir restaurant
                    </button>
                </div>
            </div>
        </div>
    )
}
