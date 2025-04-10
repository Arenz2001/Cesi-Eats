'use client'

import { Pencil, Trash } from 'lucide-react'

export default function MenuCard({ title, description, image, price, category, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
            <div className="relative">
                <img 
                    src={image} 
                    alt={title} 
                    className="h-40 w-full object-cover"
                    onError={(e) => {
                        e.target.src = '/placeholder-food.jpg'; // Image par défaut si l'URL est invalide
                    }}
                />
                {price && (
                    <div className="absolute bottom-2 right-2 bg-orange-500 text-white py-1 px-3 rounded-full text-sm font-semibold">
                        {price}
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col justify-between flex-1">
                <div className="mb-3">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                        {category && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {category}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onEdit}
                        className="bg-orange-100 hover:bg-orange-200 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                        <Pencil size={14} /> Modifier
                    </button>
                    <button
                        onClick={onDelete}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                        <Trash size={14} /> Supprimer
                    </button>
                </div>
            </div>
        </div>
    )
}
