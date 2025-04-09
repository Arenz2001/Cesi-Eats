'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditMenuPage() {
    const router = useRouter()
    const params = useParams()
    const menuId = params.id

    // 🔧 Simulation de fetch du menu via l’id
    const [form, setForm] = useState({
        title: '',
        description: '',
        image: '',
    })

    useEffect(() => {
        // Simule un fetch depuis un backend
        const fakeMenu = {
            id: menuId,
            title: 'Menu Burger Gourmet',
            description: 'Un délicieux burger avec fromage, salade, bacon croustillant et sauce maison.',
            image: '/lasagnes.jpg',
        }

        setForm(fakeMenu)
    }, [menuId])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('✅ Menu modifié :', form)
        router.push('/menus') // Redirection après modif
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] px-6 py-12">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">✏️ Modifier le menu</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="text-sm text-gray-600 block mb-1">Titre</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
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

                    {/* Aperçu image */}
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Image actuelle</p>
                        <img src={form.image} alt={form.title} className="h-40 w-full object-cover rounded-lg mb-2" />
                        <input
                            type="text"
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="URL de l'image"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow transition"
                        >
                            Enregistrer les modifications
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
