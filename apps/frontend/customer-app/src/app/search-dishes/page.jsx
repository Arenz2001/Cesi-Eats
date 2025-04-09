'use client'

import { useState } from 'react'
import Dish from '@/components/Dishes'
import { Search } from 'lucide-react'
import { useCart } from '@/context/CartContext';
import Toast from '@/components/Toast';

const dishesData = [
    { id: '1', name: 'Spaghetti Carbonara', desc: 'Recette originale', price: '12.99', likes: 24, imageUrl: '/lasagnes.jpg', quantity: 0 },
    { id: '2', name: 'Chicken Tikka Masala', desc: 'Un classique indien épicé', price: '10.49', likes: 13, imageUrl: '/lasagnes.jpg', quantity: 0 },
    { id: '3', name: 'Lasagnes', desc: 'Un repas italien typique', price: '12.99', likes: 24, imageUrl: '/lasagnes.jpg', quantity: 0 },
    { id: '4', name: 'Gnocchi chèvre épinards', desc: 'Une valeur sûre!', price: '10.49', likes: 13, imageUrl: '/lasagnes.jpg', quantity: 0 },
    { id: '5', name: 'Tartine d’avocats', desc: 'Un repas bien équilibré', price: '7.99', likes: 24, imageUrl: '/lasagnes.jpg', quantity: 0 },
    { id: '6', name: 'Sauté de bœuf', desc: 'Rapide à manger et savoureux!', price: '14.99', likes: 19, imageUrl: '/lasagnes.jpg', quantity: 0 },
    { id: '7', name: 'Risotto aux champignons', desc: 'Crémeux et délicieux!', price: '9.99', likes: 24, imageUrl: '/lasagnes.jpg', quantity: 0 },
    { id: '8', name: 'Tiramisu', desc: 'Un classique italien!', price: '6.99', likes: 30, imageUrl: '/lasagnes.jpg', quantity: 0 },
]

export default function DishListing() {

    const [search, setSearch] = useState('')
    const [showToast, setShowToast] = useState(false)
    const handleShowToast = () => {
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }
    const filteredDishes = dishesData.filter((dish) =>
        dish.name.toLowerCase().includes(search.toLowerCase()) ||
        dish.desc.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="px-6 py-24 bg-[#f9f9f9] min-h-screen">
            {/* Barre de recherche */}
            <div className="flex justify-center mb-10">
                <div className="relative w-full max-w-xl">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un plat ou un menu..."
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
            <img src={dish.imageUrl} alt={dish.name} className="h-40 w-full object-cover" />
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-800">{dish.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{dish.desc}</p>
                <p className="text-orange-500 font-semibold mb-4">{dish.price} €</p>
                <div className="mt-auto flex justify-between items-center">
                    <span className="text-sm text-gray-500">{dish.likes} ❤️</span>
                    <button
                        onClick={handleAddToCart}
                        className="text-sm bg-green-500 hover:bg-green-600 cursor-pointer text-white px-4 py-1 rounded-full transition"
                    >
                        Ajouter au panier
                    </button>
                    <button
                        className="text-sm bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-4 py-1 rounded-full transition"
                        onClick={() => alert(`Voir le détail de ${dish.name}`)}
                    >
                        Voir le détail
                    </button>
                </div>
            </div>
        </div>
    )
}
