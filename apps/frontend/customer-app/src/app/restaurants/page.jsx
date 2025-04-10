'use client'

import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation' // ✅ Ajout

export default function RestaurantFilter() {
    const searchParams = useSearchParams()

    // Plus tard, ces données viendront de ton back via API
    const [restaurants, setRestaurants] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCuisine, setSelectedCuisine] = useState('All')
    const [selectedRatings, setSelectedRatings] = useState([4, 3])
    const [selectedCategory, setSelectedCategory] = useState('All')

    // Simule un fetch depuis ton back
    useEffect(() => {

        const cuisine = searchParams.get('cuisine');
        const category = searchParams.get('category');
        if (cuisine) {
            setSelectedCuisine(cuisine);
        }
        if (category) {
            setSelectedCategory(category);
        }
        // Remplace cette partie avec un appel API plus tard
        const fetchRestaurants = async () => {
            const data = [
                {
                    name: 'La Piazza',
                    cuisine: 'Italian',
                    description: 'Restaurant Italien authentique!',
                    rating: 4,
                    image: '/pizza.png',
                    category: "Fast Food"

                },
                {
                    name: 'El Sol',
                    cuisine: 'Mexican',
                    description: 'Spicy and flavorful Mexican dishes.',
                    rating: 4,
                    image: '/pizza.png',
                    category: "Healthy"

                },
                {
                    name: 'Sushi Zen',
                    cuisine: 'Japanese',
                    description: 'Fresh sushi and sashimi crafted to perfection.',
                    rating: 4.5,
                    image: '/pizza.png',
                    category: "Fast Food"

                },
                {
                    name: 'El Sol',
                    cuisine: 'Mexican',
                    description: 'Spicy and flavorful Mexican dishes.',
                    rating: 4,
                    image: '/pizza.png',
                    category: "Healthy"

                },
                {
                    name: 'Sushi Zen',
                    cuisine: 'Japanese',
                    description: 'Fresh sushi and sashimi crafted to perfection.',
                    rating: 4.5,
                    image: '/pizza.png',
                    category: "Pizza"

                },
            ]
            setRestaurants(data)
        }

        fetchRestaurants()
    }, [searchParams])



    // Logique de filtrage
    const filteredRestaurants = restaurants.filter((restaurant) => {
        const matchCuisine =
            selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine

        const matchRating = selectedRatings.some(
            (r) => Math.floor(restaurant.rating) === r
        )

        const matchSearch =
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchCategory =
            selectedCategory === 'All' || restaurant.category === selectedCategory

        return matchCuisine && matchRating && matchSearch && matchCategory
    })

    return (
        <div className="flex flex-col lg:flex-row gap-6 px-6 py-24 bg-[#fffefc]">
            {/* Sidebar Filtres */}
            <aside className="lg:w-1/4 w-full p-4 rounded-xl border shadow-sm bg-white">
                <h2 className="text-xl font-bold mb-4">Filtres</h2>

                {/* Cuisine */}
                <div className="mb-6">
                    <label htmlFor="cuisine" className="block text-sm font-medium mb-1">
                        Type de cuisine
                    </label>
                    <select
                        id="cuisine"
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="All">Toutes</option>
                        <option value="Italian">Italienne</option>
                        <option value="Mexican">Mexicaine</option>
                        <option value="Japanese">Japonaise</option>
                    </select>
                </div>

                {/* Catégorie */}
                <div className="mb-6">
                    <label htmlFor="category" className="block text-sm font-medium mb-1">
                        Catégorie
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="All">Toutes</option>
                        <option value="Fast Food">Fast Food</option>
                        <option value="Pizza">Pizza</option>
                        <option value="Healthy">Healthy</option>
                    </select>
                </div>

                {/* Rating */}
                <div>
                    <p className="text-sm font-medium mb-2">Évaluation</p>
                    {[4, 3].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 mb-1 text-sm">
                            <input
                                type="checkbox"
                                checked={selectedRatings.includes(rating)}
                                onChange={() =>
                                    setSelectedRatings((prev) =>
                                        prev.includes(rating)
                                            ? prev.filter((r) => r !== rating)
                                            : [...prev, rating]
                                    )
                                }
                            />
                            {rating} ★
                        </label>
                    ))}
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1">
                {/* Search bar */}
                <div className="relative mb-8 w-full max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder="Rechercher un restaurant..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {/* Grid restaurants */}
                {filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRestaurants.map((restaurant, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                            >
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                                    <p className="text-yellow-600 text-sm mb-4">
                                        {"★".repeat(Math.floor(restaurant.rating))}{" "}
                                        {restaurant.rating % 1 ? "½" : ""}
                                    </p>
                                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full text-sm font-medium transition">
                                        Voir la carte
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-sm mt-10">Aucun restaurant trouvé.</p>
                )}
            </main>
        </div>
    )
}
