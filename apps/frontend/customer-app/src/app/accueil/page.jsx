'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import categoriesList from '../models/categories'
import Categories from '@/components/Categories'

export default function HomePage() {
    const router = useRouter()
    const { isAuthenticated, user } = useAuth()
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [cuisineTypes, setCuisineTypes] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [searchSuggestions, setSearchSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [activeOrders, setActiveOrders] = useState([])
    const [loadingOrders, setLoadingOrders] = useState(false)

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('http://localhost:3002/')
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des restaurants')
                }
                const data = await response.json()
                setRestaurants(data)
                
                // Extraire les types de cuisine uniques depuis les restaurants
                const uniqueCuisines = [...new Set(data.map(restaurant => restaurant.cuisineType).filter(Boolean))]
                setCuisineTypes(uniqueCuisines)
                
                setLoading(false)
            } catch (err) {
                console.error('Erreur lors du chargement des restaurants:', err)
                setError(err.message)
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [])

    // Charger les commandes actives de l'utilisateur
    useEffect(() => {
        // Ne chercher des commandes que si l'utilisateur est connecté
        if (!isAuthenticated || !user?.id) return;

        const fetchActiveOrders = async () => {
            try {
                setLoadingOrders(true);
                const response = await fetch(`http://localhost:3003/client/${user.id}`);
                
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des commandes');
                }
                
                const ordersData = await response.json();
                
                // Filtrer pour ne garder que les commandes actives (non livrées et non annulées)
                const active = ordersData.filter(order => 
                    order.status !== 'delivered' && 
                    order.status !== 'cancelled'
                );
                
                setActiveOrders(active);
            } catch (error) {
                console.error('Erreur lors du chargement des commandes actives:', error);
            } finally {
                setLoadingOrders(false);
            }
        };
        
        fetchActiveOrders();
    }, [isAuthenticated, user]);

    // Générer des suggestions basées sur le terme de recherche
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchSuggestions([])
            setShowSuggestions(false)
            return
        }

        // Rechercher dans les noms de restaurants
        const restaurantMatches = restaurants
            .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(r => ({ type: 'restaurant', name: r.name, id: r._id }))
            .slice(0, 3)

        // Rechercher dans les types de cuisine
        const cuisineMatches = cuisineTypes
            .filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(c => ({ type: 'cuisine', name: c }))
            .slice(0, 2)

        // Rechercher dans les plats
        const dishMatches = restaurants
            .flatMap(r => r.dishes?.map(d => ({ 
                type: 'dish', 
                name: d.name, 
                restaurantId: r._id, 
                restaurantName: r.name 
            })) || [])
            .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 3)

        const suggestions = [...restaurantMatches, ...cuisineMatches, ...dishMatches].slice(0, 6)
        setSearchSuggestions(suggestions)
        setShowSuggestions(suggestions.length > 0)
    }, [searchQuery, restaurants, cuisineTypes])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'restaurant') {
            router.push(`/restaurant/${suggestion.id}`)
        } else if (suggestion.type === 'cuisine') {
            router.push(`/restaurants?cuisine=${encodeURIComponent(suggestion.name)}`)
        } else if (suggestion.type === 'dish') {
            router.push(`/restaurant/${suggestion.restaurantId}`)
        }
        setShowSuggestions(false)
    }

    // Fonction pour obtenir le statut en français
    const getStatusLabel = (status) => {
        const statusMap = {
            'validated_by_client': 'Commande validée',
            'accepted_by_restaurant': 'Acceptée par le restaurant',
            'in_preparation': 'En préparation',
            'accepted_by_delivery': 'Prise en charge par le livreur',
            'on_the_way': 'En cours de livraison'
        };
        return statusMap[status] || status;
    };

    return (
        <div className="bg-white">
            {/* Notifications de commandes actives */}
            {activeOrders.length > 0 && (
                <div className="bg-green-50 border-b border-green-100">
                    <div className="container mx-auto px-6 py-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping mr-2"></div>
                                <span className="font-medium text-green-800">
                                    Vous avez {activeOrders.length} commande{activeOrders.length > 1 ? 's' : ''} en cours
                                </span>
                            </div>
                            <div className="flex flex-wrap justify-center sm:justify-end gap-2">
                                {activeOrders.map((order, index) => (
                                    <Link href={`/order-confirm?id=${order._id}`} key={index}>
                                        <button className="text-xs bg-white text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                                            #{order.order_id.substring(0, 8)} - {getStatusLabel(order.status)}
                                        </button>
                                    </Link>
                                ))}
                                <Link href="/profil">
                                    <button className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors">
                                        Voir toutes
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-24 py-16 gap-8">
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-snug max-w-xl mx-auto lg:mx-0">
                        Découvrez les meilleurs restaurants près de chez vous 🍽️
                    </h1>
                    <form onSubmit={handleSearch} className="relative">
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                            <div className="w-full sm:w-[400px] relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Restaurants, cuisines, plats..."
                                    className="border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 pl-10"
                                    onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                
                                {/* Suggestions de recherche */}
                                {showSuggestions && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        {searchSuggestions.map((suggestion, index) => (
                                            <div 
                                                key={index} 
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                {suggestion.type === 'restaurant' && (
                                                    <>
                                                        <span className="text-orange-500 text-xs mr-2 bg-orange-100 px-2 py-0.5 rounded-full">Restaurant</span>
                                                        {suggestion.name}
                                                    </>
                                                )}
                                                {suggestion.type === 'cuisine' && (
                                                    <>
                                                        <span className="text-blue-500 text-xs mr-2 bg-blue-100 px-2 py-0.5 rounded-full">Cuisine</span>
                                                        {suggestion.name}
                                                    </>
                                                )}
                                                {suggestion.type === 'dish' && (
                                                    <>
                                                        <span className="text-green-500 text-xs mr-2 bg-green-100 px-2 py-0.5 rounded-full">Plat</span>
                                                        {suggestion.name} <span className="text-gray-400 text-xs ml-1">({suggestion.restaurantName})</span>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button 
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md text-sm font-medium"
                            >
                                Rechercher
                            </button>
                        </div>
                    </form>
                </div>

                <div className="flex justify-center flex-1">
                    <Image
                        src="/accueil.png"
                        alt="Livreur"
                        width={350}
                        height={350}
                        className="object-contain"
                    />
                </div>
            </section>

            {/* Catégories */}
            <section className="px-6 lg:px-24 py-12 bg-[#fff7ea] text-center">
                <h2 className="text-3xl font-bold mb-8">Nos catégories</h2>
                
                {loading ? (
                    // État de chargement pour les catégories
                    <div className="flex flex-wrap gap-6 justify-center">
                        {[1, 2, 3, 4].map((index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden w-64 animate-pulse">
                                <div className="h-36 bg-gray-200"></div>
                                <div className="p-4">
                                    <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-6 justify-center">
                        {/* Afficher d'abord les catégories prédéfinies */}
                        {categoriesList.map((category, index) => (
                            <Categories
                                key={`preset-${index}`}
                                name={category.name}
                                image={category.image}
                                description={category.description}
                                onClick={() => {
                                    window.location.href = `/restaurants?cuisine=${category.name}`;
                                }}
                            />
                        ))}
                        
                        {/* Ensuite, ajouter des catégories basées sur les types de cuisine si elles ne sont pas déjà dans la liste prédéfinie */}
                        {cuisineTypes
                            .filter(cuisine => !categoriesList.some(cat => cat.name === cuisine))
                            .map((cuisine, index) => {
                                // Trouver un restaurant avec ce type de cuisine pour avoir une image
                                const restaurant = restaurants.find(r => r.cuisineType === cuisine)
                                return (
                                    <Categories
                                        key={`cuisine-${index}`}
                                        name={cuisine}
                                        image={restaurant?.imageUrl || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3'}
                                        description={`Spécialités ${cuisine.toLowerCase()}`}
                                        onClick={() => {
                                            window.location.href = `/restaurants?cuisine=${cuisine}`;
                                        }}
                                    />
                                )
                            })
                        }
                    </div>
                )}
            </section>

            {/* Offres + Contenu */}
            <div className="flex flex-col lg:flex-row gap-6 px-6 lg:px-24 py-12">
                {/* Sidebar */}
                <aside className="lg:w-1/4 space-y-6">
                    <SpecialOffer
                        title="Spécialités pizzas"
                        discount="20% OFF"
                        cta="Acheter maintenant"
                    />
                    <SpecialOffer
                        title="Nouvelle alerte menu"
                        discount="20% OFF"
                        cta="Acheter maintenant"
                    />
                    <div className="bg-orange-500 text-white text-center p-6 rounded-xl shadow-lg">
                        <h3 className="font-bold text-lg">🎉 PROMOTIONS</h3>
                        <p className="text-sm">Offre à durée limitée</p>
                        <span className="text-3xl font-bold mt-2 block">10:57</span>
                    </div>
                </aside>

                {/* Contenu principal */}
                <main className="flex-1 space-y-12">
                    {/* Restaurants populaires */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">🍴 Restaurants populaires</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {loading ? (
                                // Affichage d'un état de chargement
                                Array(6).fill().map((_, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                                        <div className="h-40 bg-gray-200 rounded-md mb-3"></div>
                                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))
                            ) : error ? (
                                // Affichage de l'erreur
                                <div className="col-span-3 bg-red-100 text-red-700 p-4 rounded-lg">
                                    <p>Impossible de charger les restaurants: {error}</p>
                                </div>
                            ) : (
                                // Affichage des restaurants
                                restaurants.slice(0, 6).map((restaurant, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                                    >
                                        <div className="h-40 relative">
                                            <img 
                                                src={restaurant.imageUrl || '/pizza.png'} 
                                                alt={restaurant.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-800">{restaurant.name}</h3>
                                            <p className="text-sm text-gray-600 truncate">{restaurant.address.city}</p>
                                            <p className="text-sm text-orange-600 mt-1">{restaurant.cuisineType}</p>
                                            <Link href={`/restaurant/${restaurant._id}`}>
                                                <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium transition">
                                                    Voir la carte
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Plats populaires */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">🍛 Plats populaires</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {loading ? (
                                // Affichage d'un état de chargement
                                Array(2).fill().map((_, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                                        <div className="h-56 bg-gray-200 rounded-md mb-3"></div>
                                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))
                            ) : error ? (
                                // Affichage de l'erreur
                                <div className="col-span-2 bg-red-100 text-red-700 p-4 rounded-lg">
                                    <p>Impossible de charger les plats: {error}</p>
                                </div>
                            ) : (
                                // Récupérer quelques plats populaires des restaurants
                                restaurants.slice(0, 2).map((restaurant, index) => {
                                    // Prendre le premier plat du restaurant s'il existe
                                    const dish = restaurant.dishes && restaurant.dishes.length > 0 
                                        ? restaurant.dishes[0] 
                                        : null;
                                    
                                    return (
                                        <div 
                                            key={index} 
                                            className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                                        >
                                            <div className="h-56 relative">
                                                <img 
                                                    src={dish?.imageUrl || '/pizza.png'} 
                                                    alt={dish?.name || "Plat spécial"} 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                    <h3 className="font-semibold text-white text-lg">
                                                        {dish?.name || "Plat spécial"}
                                                    </h3>
                                                    <p className="text-white/80 text-sm">
                                                        {restaurant.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-4 flex justify-between items-center">
                                                <span className="font-bold text-orange-600">{dish?.price || 0} €</span>
                                                <Link href={`/restaurant/${restaurant._id}`}>
                                                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm font-medium transition">
                                                        Commander
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

function SpecialOffer({ title, discount, cta }) {
    return (
        <div className="bg-orange-100 p-4 rounded-xl shadow text-center">
            <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
            <span className="block text-orange-600 font-bold text-lg">{discount}</span>
            <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition">
                {cta}
            </button>
        </div>
    )
}