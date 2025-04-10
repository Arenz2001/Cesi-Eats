'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function EditDishPage() {
    const router = useRouter()
    const params = useParams()
    const dishId = params.id
    const { user, getAuthToken } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    // Formulaire pour éditer un plat
    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: ''
    })

    // Récupérer les données du plat depuis l'API
    useEffect(() => {
        const fetchDish = async () => {
            if (!user?.id || !dishId) {
                setIsLoading(false)
                return
            }
            
            try {
                setIsLoading(true)
                
                // Récupérer tous les plats du restaurant
                const response = await fetch(`https://api-cesieats.arenz-proxmox.fr/restaurants/${user.id}/menu`, {
                    headers: {
                        'Authorization': `Bearer ${getAuthToken()}`
                    }
                })
                
                if (!response.ok) {
                    throw new Error(`Erreur: ${response.status}`)
                }
                
                const dishes = await response.json()
                
                // Trouver le plat spécifique par son ID
                const dish = dishes.find(d => d._id === dishId)
                
                if (!dish) {
                    throw new Error('Plat non trouvé')
                }
                
                // Remplir le formulaire avec les données du plat
                setForm({
                    name: dish.name || '',
                    price: dish.price ? dish.price.toString() : '',
                    description: dish.description || '',
                    category: dish.category || '',
                    image: dish.image || ''
                })
            } catch (err) {
                console.error('Erreur lors du chargement du plat:', err)
                setError('Impossible de charger les informations du plat')
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchDish()
    }, [user, dishId, getAuthToken])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        
        if (!user?.id || !dishId) {
            setError("Vous devez être connecté pour modifier un plat")
            return
        }
        
        if (!form.name || !form.price) {
            setError("Le nom et le prix sont obligatoires")
            return
        }
        
        setIsSubmitting(true)
        
        try {
            const dishData = {
                name: form.name,
                price: parseFloat(form.price),
                description: form.description,
                category: form.category,
                // L'image est optionnelle
                ...(form.image && { image: form.image })
            }
            
            const response = await fetch(`https://api-cesieats.arenz-proxmox.fr/restaurants/${user.id}/dishes/${dishId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(dishData)
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `Erreur (${response.status})`)
            }
            
            // Redirection vers la page des plats après modification réussie
            router.push('/articles')
        } catch (err) {
            console.error('Erreur lors de la modification du plat:', err)
            setError(err.message || "Une erreur est survenue lors de la modification du plat")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#f9f9f9]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] px-6 py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">✏️ Modifier le plat</h1>
                
                {error && (
                    <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="text-sm text-gray-600 block mb-1">Nom du plat*</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="text-sm text-gray-600 block mb-1">Prix (€)*</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="category" className="text-sm text-gray-600 block mb-1">Catégorie</label>
                        <select
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <option value="">Sélectionnez une catégorie</option>
                            <option value="Entrée">Entrée</option>
                            <option value="Plat principal">Plat principal</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Boisson">Boisson</option>
                            <option value="Accompagnement">Accompagnement</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="text-sm text-gray-600 block mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label htmlFor="image" className="text-sm text-gray-600 block mb-1">Image (URL)</label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="URL de l'image"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                        {form.image && (
                            <img 
                                src={form.image} 
                                alt={form.name} 
                                className="mt-3 w-full h-40 object-cover rounded-lg shadow"
                                onError={(e) => {
                                    e.target.src = '/placeholder-food.jpg';
                                }}
                            />
                        )}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${isSubmitting ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'} text-white px-6 py-2 rounded-full shadow transition flex items-center`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enregistrement...
                                </>
                            ) : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

