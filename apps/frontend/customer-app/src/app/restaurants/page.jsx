'use client'

import React, { useEffect, useState } from 'react'
import { Search, MapPin, Filter, Star, TagIcon, DollarSignIcon, Clock } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function RestaurantFilter() {
    const searchParams = useSearchParams()

    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCuisine, setSelectedCuisine] = useState('All')
    const [selectedPriceRange, setSelectedPriceRange] = useState('All')
    const [selectedCity, setSelectedCity] = useState('All')
    const [selectedOffers, setSelectedOffers] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')
    
    // Liste des types de cuisine disponibles
    const [cuisineTypes, setCuisineTypes] = useState(['All'])
    const [categoryTypes, setCategoryTypes] = useState(['All'])
    const [cityList, setCityList] = useState(['All'])

    // Prix prédéfinis
    const priceRanges = [
        { value: 'All', label: 'Tous les prix' },
        { value: 'budget', label: 'Économique (< 15€)' },
        { value: 'moderate', label: 'Modéré (15-25€)' },
        { value: 'expensive', label: 'Cher (> 25€)' }
    ]

    // Offres spéciales
    const offerOptions = [
        { value: 'livraison_gratuite', label: 'Livraison gratuite' },
        { value: 'reduction', label: 'Réduction' },
        { value: 'nouveaute', label: 'Nouveau restaurant' }
    ]

    useEffect(() => {
        const cuisine = searchParams.get('cuisine');
        const category = searchParams.get('category');
        const city = searchParams.get('city');
        const search = searchParams.get('search');
        
        if (cuisine) {
            setSelectedCuisine(cuisine);
        }
        if (category) {
            setSelectedCategory(category);
        }
        if (city) {
            setSelectedCity(city);
        }
        if (search) {
            setSearchQuery(search);
        }
        
        // Fonction pour récupérer les restaurants depuis l'API
        const fetchRestaurants = async () => {
            setLoading(true)
            try {
                const response = await fetch('http://localhost:3002/')
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des restaurants')
                }
                const data = await response.json()
                
                setRestaurants(data)
                
                // Extraire les types de cuisine uniques
                const cuisines = ['All', ...new Set(data.map(restaurant => restaurant.cuisineType).filter(Boolean))]
                setCuisineTypes(cuisines)
                
                // Extraire les catégories uniques des plats
                const categories = ['All']
                data.forEach(restaurant => {
                    restaurant.dishes.forEach(dish => {
                        if (dish.category && !categories.includes(dish.category)) {
                            categories.push(dish.category)
                        }
                    })
                })
                setCategoryTypes(categories)
                
                // Extraire les villes uniques
                const cities = ['All', ...new Set(data.map(restaurant => restaurant.address.city).filter(Boolean))]
                setCityList(cities)
                
                setLoading(false)
            } catch (err) {
                console.error('Erreur lors du chargement des restaurants:', err)
                setError(err.message)
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [searchParams])

    // Fonction pour calculer le prix moyen d'un restaurant
    const getAveragePrice = (restaurant) => {
        if (!restaurant.dishes || restaurant.dishes.length === 0) return 0;
        const sum = restaurant.dishes.reduce((acc, dish) => acc + dish.price, 0);
        return sum / restaurant.dishes.length;
    }

    // Fonction pour rechercher dans les restaurants et les plats
    const matchesSearch = (restaurant, query) => {
        if (!query) return true;
        
        const lowerQuery = query.toLowerCase();
        
        // Recherche dans le nom du restaurant
        if (restaurant.name.toLowerCase().includes(lowerQuery)) return true;
        
        // Recherche dans la description du restaurant
        if (restaurant.description && restaurant.description.toLowerCase().includes(lowerQuery)) return true;
        
        // Recherche dans le type de cuisine
        if (restaurant.cuisineType && restaurant.cuisineType.toLowerCase().includes(lowerQuery)) return true;
        
        // Recherche dans l'adresse
        if (restaurant.address) {
            const address = [
                restaurant.address.street,
                restaurant.address.city,
                restaurant.address.postalCode,
                restaurant.address.country
            ].filter(Boolean).join(' ').toLowerCase();
            
            if (address.includes(lowerQuery)) return true;
        }
        
        // Recherche dans les plats
        if (restaurant.dishes && restaurant.dishes.length > 0) {
            return restaurant.dishes.some(dish => (
                dish.name.toLowerCase().includes(lowerQuery) ||
                (dish.description && dish.description.toLowerCase().includes(lowerQuery)) ||
                (dish.category && dish.category.toLowerCase().includes(lowerQuery))
            ));
        }
        
        return false;
    }

    // Logique de filtrage
    const filteredRestaurants = restaurants.filter((restaurant) => {
        const matchCuisine =
            selectedCuisine === 'All' || restaurant.cuisineType === selectedCuisine

        const matchSearch = matchesSearch(restaurant, searchQuery);

        // Vérifier si un plat du restaurant correspond à la catégorie sélectionnée
        const matchCategory =
            selectedCategory === 'All' || 
            restaurant.dishes.some(dish => dish.category === selectedCategory)
            
        // Filtre par ville
        const matchCity = 
            selectedCity === 'All' || 
            restaurant.address.city === selectedCity
        
        // Filtre par gamme de prix
        const avgPrice = getAveragePrice(restaurant);
        const matchPrice = 
            selectedPriceRange === 'All' || 
            (selectedPriceRange === 'budget' && avgPrice < 15) ||
            (selectedPriceRange === 'moderate' && avgPrice >= 15 && avgPrice <= 25) ||
            (selectedPriceRange === 'expensive' && avgPrice > 25)
        
        // Pour l'instant, les offres sont simulées (à implémenter réellement plus tard)
        // Considérons que tous les restaurants correspondent si aucune offre n'est sélectionnée
        const matchOffers = selectedOffers.length === 0 || 
            selectedOffers.includes('reduction') || // Simulation pour la démonstration
            selectedOffers.includes('nouveaute');   // Simulation pour la démonstration

        return matchCuisine && matchSearch && matchCategory && matchCity && matchPrice && matchOffers
    })

    // Fonction pour gérer les offres (multiple sélection)
    const handleOfferToggle = (value) => {
        setSelectedOffers(prev => 
            prev.includes(value) 
                ? prev.filter(v => v !== value) 
                : [...prev, value]
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    <p className="font-bold">Erreur de chargement</p>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 px-6 py-24 bg-[#fffefc]">
            {/* Sidebar Filtres */}
            <aside className="lg:w-1/4 w-full p-6 rounded-xl border shadow-sm bg-white">
                <div className="flex items-center gap-2 mb-6">
                    <Filter size={18} className="text-orange-500" />
                    <h2 className="text-xl font-bold">Filtres</h2>
                </div>

                {/* Cuisine */}
                <div className="mb-6">
                    <label htmlFor="cuisine" className="flex items-center gap-2 text-sm font-medium mb-2">
                        <TagIcon size={16} className="text-orange-500" />
                        Type de cuisine
                    </label>
                    <select
                        id="cuisine"
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                    >
                        {cuisineTypes.map((cuisine, index) => (
                            <option key={index} value={cuisine}>
                                {cuisine === 'All' ? 'Toutes les cuisines' : cuisine}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ville */}
                <div className="mb-6">
                    <label htmlFor="city" className="flex items-center gap-2 text-sm font-medium mb-2">
                        <MapPin size={16} className="text-orange-500" />
                        Ville
                    </label>
                    <select
                        id="city"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                    >
                        {cityList.map((city, index) => (
                            <option key={index} value={city}>
                                {city === 'All' ? 'Toutes les villes' : city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Prix */}
                <div className="mb-6">
                    <label htmlFor="price" className="flex items-center gap-2 text-sm font-medium mb-2">
                        <DollarSignIcon size={16} className="text-orange-500" />
                        Budget
                    </label>
                    <select
                        id="price"
                        value={selectedPriceRange}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                    >
                        {priceRanges.map((range, index) => (
                            <option key={index} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Catégorie de plats */}
                <div className="mb-6">
                    <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Clock size={16} className="text-orange-500" />
                        Type de plats
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                    >
                        {categoryTypes.map((category, index) => (
                            <option key={index} value={category}>
                                {category === 'All' ? 'Tous les types de plats' : category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Offres spéciales */}
                <div>
                    <p className="flex items-center gap-2 text-sm font-medium mb-2">
                        <Star size={16} className="text-orange-500" />
                        Offres spéciales
                    </p>
                    {offerOptions.map((offer, index) => (
                        <label key={index} className="flex items-center gap-2 mb-2 text-sm">
                            <input
                                type="checkbox"
                                checked={selectedOffers.includes(offer.value)}
                                onChange={() => handleOfferToggle(offer.value)}
                                className="accent-orange-500"
                            />
                            {offer.label}
                        </label>
                    ))}
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1">
                {/* Search bar */}
                <div className="relative mb-8 w-full max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Rechercher un restaurant..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {/* Nombre de résultats */}
                <p className="text-gray-600 mb-4">
                    {filteredRestaurants.length} {filteredRestaurants.length > 1 ? 'restaurants trouvés' : 'restaurant trouvé'}
                </p>

                {/* Grid restaurants */}
                {filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRestaurants.map((restaurant, index) => {
                            const avgPrice = getAveragePrice(restaurant);
                            let priceIndicator = '';
                            
                            if (avgPrice < 15) priceIndicator = '€';
                            else if (avgPrice <= 25) priceIndicator = '€€';
                            else priceIndicator = '€€€';

                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                                >
                                    <div className="h-48 relative">
                                        <img
                                            src={restaurant.imageUrl || '/pizza.png'}
                                            alt={restaurant.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Simulation d'un badge pour les nouvelles offres */}
                                        {index % 3 === 0 && (
                                            <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                                Nouveau
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
                                            <span className="text-gray-500 text-sm">{priceIndicator}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">{restaurant.description || `Cuisine ${restaurant.cuisineType}`}</p>
                                        <div className="flex items-center gap-1 mb-2">
                                            <MapPin size={14} className="text-orange-500" />
                                            <p className="text-xs text-gray-500">
                                                {restaurant.address.city}, {restaurant.address.postalCode}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                                {restaurant.cuisineType}
                                            </span>
                                            {restaurant.dishes.length > 0 && (
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                    {restaurant.dishes.length} plats
                                                </span>
                                            )}
                                        </div>
                                        <Link href={`/restaurant/${restaurant._id}`}>
                                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-full text-sm font-medium transition">
                                                Voir la carte
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-sm mt-10">Aucun restaurant ne correspond à votre recherche.</p>
                        <button 
                            onClick={() => {
                                setSelectedCuisine('All');
                                setSelectedCategory('All');
                                setSelectedCity('All');
                                setSelectedPriceRange('All');
                                setSelectedOffers([]);
                                setSearchQuery('');
                            }}
                            className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-medium"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
