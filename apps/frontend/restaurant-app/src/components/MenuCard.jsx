'use client'

import { Pencil, Trash } from 'lucide-react'

export default function MenuCard({ title, description, image, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
            <img src={image} alt={title} className="h-40 w-full object-cover" />

            <div className="p-4 flex flex-col justify-between flex-1">
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
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
