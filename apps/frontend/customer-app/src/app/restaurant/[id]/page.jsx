'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, Clock, Phone, ChevronLeft, ShoppingBag, Info } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { toast } from 'react-hot-toast'

export default function RestaurantDetail() {
    const params = useParams()
    const { id } = params
    
    const [restaurant, setRestaurant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('Tout')
    
    const { addToCart } = useCart()
    
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await fetch(`http://localhost:3002/${id}`)
                if (!response.ok) {
                    throw new Error('Restaurant non trouvé')
                }
                const data = await response.json()
                setRestaurant(data)
                
                // Définir la première catégorie comme sélectionnée s'il y en a
                if (data.dishes && data.dishes.length > 0) {
                    const categories = ['Tout', ...new Set(data.dishes.map(dish => dish.category).filter(Boolean))]
                    if (categories.length > 1) {
                        setSelectedCategory(categories[0])
                    }
                }
                
                setLoading(false)
            } catch (err) {
                console.error('Erreur lors du chargement du restaurant:', err)
                setError(err.message)
                setLoading(false)
            }
        }
        
        if (id) {
            fetchRestaurant()
        }
    }, [id])
    
    const handleAddToCart = (dish) => {
        addToCart({
            id: dish._id,
            name: dish.name,
            price: dish.price,
            quantity: 1,
            imageUrl: dish.imageUrl,
            restaurantId: restaurant._id,
            restaurantName: restaurant.name
        })
        toast.success(`${dish.name} ajouté au panier`)
    }
    
    const getDishCategories = () => {
        if (!restaurant || !restaurant.dishes) return ['Tout']
        return ['Tout', ...new Set(restaurant.dishes.map(dish => dish.category).filter(Boolean))]
    }
    
    const filteredDishes = () => {
        if (!restaurant || !restaurant.dishes) return []
        if (selectedCategory === 'Tout') return restaurant.dishes
        return restaurant.dishes.filter(dish => dish.category === selectedCategory)
    }
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }
    
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen p-4">
                <div className="bg-red-100 text-red-700 p-6 rounded-lg max-w-md text-center">
                    <Info size={40} className="mx-auto mb-4 text-red-500" />
                    <h2 className="text-xl font-bold mb-2">Erreur</h2>
                    <p className="mb-4">{error}</p>
                    <Link href="/restaurants">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
                            Retour aux restaurants
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
    
    if (!restaurant) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen p-4">
                <div className="bg-yellow-100 text-yellow-700 p-6 rounded-lg max-w-md text-center">
                    <Info size={40} className="mx-auto mb-4 text-yellow-500" />
                    <h2 className="text-xl font-bold mb-2">Restaurant non trouvé</h2>
                    <p className="mb-4">Nous n'avons pas trouvé le restaurant demandé.</p>
                    <Link href="/restaurants">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
                            Voir tous les restaurants
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
    
    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Header avec image de couverture */}
            <div className="relative h-64 md:h-80">
                <img 
                    src={restaurant.imageUrl || "/pizza.png"} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <Link href="/restaurants" className="absolute top-4 left-4 bg-white p-2 rounded-full shadow hover:bg-gray-100">
                    <ChevronLeft className="text-black" size={20} />
                </Link>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                    <p className="text-white/80">{restaurant.cuisineType}</p>
                </div>
            </div>
            
            {/* Contenu principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative">
                {/* Carte info restaurant */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                            <h2 className="text-xl font-bold mb-2">À propos</h2>
                            <p className="text-gray-600 mb-4">{restaurant.description || `Restaurant de cuisine ${restaurant.cuisineType}.`}</p>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin size={18} className="text-orange-500" />
                                <span className="text-gray-700">
                                    {restaurant.address.street}, {restaurant.address.postalCode} {restaurant.address.city}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <Clock size={18} className="text-orange-500" />
                                <span className="text-gray-700">Ouvert de 11h à 23h</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Phone size={18} className="text-orange-500" />
                                <span className="text-gray-700">01 23 45 67 89</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center bg-orange-50 p-4 rounded-lg">
                            <ShoppingBag size={24} className="text-orange-500 mb-2" />
                            <p className="text-sm text-center text-gray-700 mb-2">
                                Livraison gratuite <br /> à partir de 20€
                            </p>
                            <p className="text-sm text-center text-gray-700">
                                Temps de livraison estimé: <br />
                                <span className="font-bold">30-45 min</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Onglets catégories */}
                <div className="mb-6 overflow-x-auto pb-2">
                    <div className="flex gap-2">
                        {getDishCategories().map((category, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                                    selectedCategory === category
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Liste des plats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDishes().map((dish, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            <div className="h-48 relative">
                                <img 
                                    src={dish.imageUrl || "/pizza.png"} 
                                    alt={dish.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold">{dish.name}</h3>
                                    <span className="font-semibold text-orange-500">{dish.price.toFixed(2)} €</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">{dish.description || "Plat délicieux"}</p>
                                <button
                                    onClick={() => handleAddToCart(dish)}
                                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-medium transition"
                                >
                                    Ajouter au panier
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredDishes().length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-500">Aucun plat trouvé dans cette catégorie.</p>
                    </div>
                )}
            </div>
        </div>
    )
} 