'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function CreateDishPage() {
    const router = useRouter()
    const { user, getAuthToken } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const [form, setForm] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        
        if (!user?.id) {
            setError("Vous devez être connecté pour ajouter un plat")
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
                // L'image est optionnelle, et on utilise imageUrl comme nom de champ pour correspondre au modèle
                ...(form.image && { imageUrl: form.image })
            }
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAURANT_API_URL}/${user.id_restaurant}/dishes`, {
                method: 'POST',
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
            
            // Redirection vers la page des plats après création réussie
            router.push('/articles')
        } catch (err) {
            console.error('Erreur lors de la création du plat:', err)
            setError(err.message || "Une erreur est survenue lors de la création du plat")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] px-6 py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">🍕 Ajouter un nouveau plat</h1>
                
                {error && (
                    <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nom */}
                    <div>
                        <label htmlFor="name" className="text-sm text-gray-600 block mb-1">Nom du plat*</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ex : Burger Gourmet"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
                    </div>
                    
                    {/* Prix */}
                    <div>
                        <label htmlFor="price" className="text-sm text-gray-600 block mb-1">Prix (€)*</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Ex : 12.90"
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
                    </div>

                    {/* Catégorie */}
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
                            <option value="Sushi">Sushi</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Burger">Burger</option>
                            <option value="Pâtes">Pâtes</option>
                            <option value="Salade">Salade</option>
                            <option value="Entrée">Entrée</option>
                            <option value="Plat principal">Plat principal</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Boisson">Boisson</option>
                            <option value="Accompagnement">Accompagnement</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="text-sm text-gray-600 block mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Ex : Un burger juteux avec bacon et cheddar fondu."
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
                            placeholder="Ex : https://example.com/images/burger.jpg"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                        {form.image && (
                            <img
                                src={form.image}
                                alt="aperçu"
                                className="mt-3 w-full h-40 object-cover rounded-lg shadow"
                                onError={(e) => {
                                    e.target.src = '/placeholder-food.jpg';
                                }}
                            />
                        )}
                    </div>

                    {/* Bouton */}
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.push('/articles')}
                            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${
                                isSubmitting ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'
                            } text-white px-6 py-2 rounded-full shadow transition flex items-center`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Création en cours...
                                </>
                            ) : 'Créer le plat'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
