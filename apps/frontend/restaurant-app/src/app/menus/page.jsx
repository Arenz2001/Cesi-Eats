'use client'

import { useRouter } from 'next/navigation'
import MenuCard from '@/components/MenuCard'
import { useState } from 'react'
export const menuss = [
    {
        id: '1',
        title: 'Menu Spaghetti',
        description: 'Spaghetti bolognaise avec sauce tomate maison et parmesan.',
        image: '/lasagnes.jpg',
    },
    {
        id: '2',
        title: 'Menu Salade César',
        description: 'Salade romaine, poulet grillé, croutons et sauce césar.',
        image: '/lasagnes.jpg',
    },
    {
        id: '3',
        title: 'Menu Burger Classic',
        description: 'Burger avec steak haché, cheddar, salade, tomate et oignons.',
        image: '/lasagnes.jpg',
    },
    {
        id: '4',
        title: 'Menu Vegan Bowl',
        description: 'Légumes rôtis, pois chiches, quinoa et sauce tahini.',
        image: '/lasagnes.jpg',
    },
    {
        id: '5',
        title: 'Menu Tacos Poulet',
        description: '2 Tacos au poulet croustillant avec frites et boisson.',
        image: '/lasagnes.jpg',
    },
    {
        id: '6',
        title: 'Menu Fish & Chips',
        description: 'Poisson pané avec frites maison et sauce tartare.',
        image: '/lasagnes.jpg',
    },
]

export default function MenusPage() {
    const router = useRouter()
    const [menus, setMenus] = useState(menuss)
    const [menuToDelete, setMenuToDelete] = useState(null)

    const handleEdit = (id) => {
        router.push(`/menus/edit/${id}`)
    }

    const handleAdd = () => {
        router.push('/menus/create')
    }

    const confirmDelete = () => {
        setMenus((prev) => prev.filter((m) => m.id !== menuToDelete))
        setMenuToDelete(null)
    }

    return (
        <div className="bg-[#fff7ea] min-h-screen">
            <div className="flex justify-between items-center px-6 pt-8 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">🍽️ Mes menus</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-full shadow-md transition duration-200"
                >
                    Ajouter un menu
                </button>
            </div>

            <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {menus.map((menu) => (
                    <MenuCard
                        key={menu.id}
                        title={menu.title}
                        description={menu.description}
                        image={menu.image}
                        onEdit={() => handleEdit(menu.id)}
                        onDelete={() => setMenuToDelete(menu.id)}
                    />
                ))}
            </div>

            {/* Modale de confirmation */}
            {menuToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Supprimer ce menu ?
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Cette action est irréversible.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setMenuToDelete(null)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
