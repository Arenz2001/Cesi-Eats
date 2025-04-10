'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateMenuPage() {
    const router = useRouter()

    const [form, setForm] = useState({
        title: '',
        description: '',
        image: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('✅ Nouveau menu créé :', form)
        // Tu pourras ici appeler une API POST plus tard
        router.push('/menus')
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] px-6 py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">🍽️ Créer un nouveau menu</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Titre */}
                    <div>
                        <label htmlFor="title" className="text-sm text-gray-600 block mb-1">Titre</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Ex : Menu Burger Gourmet"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            required
                        />
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
                            required
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
                            placeholder="Ex : /images/burger.jpg"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                        {form.image && (
                            <img
                                src={form.image}
                                alt="aperçu"
                                className="mt-3 w-full h-40 object-cover rounded-lg shadow"
                            />
                        )}
                    </div>

                    {/* Bouton */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow transition"
                        >
                            Créer le menu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
