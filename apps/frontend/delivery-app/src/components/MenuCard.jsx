import React from 'react'

export default function MenuCard({ image, title, description, onEdit, onDelete }) {

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full ">
            <img
                src={image}
                alt={title}
                className="rounded-md mb-4 h-40 w-full object-cover"
            />
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <div className="flex space-x-2">
                <button
                    onClick={onEdit}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                    Modifier
                </button>
                <button
                    onClick={onDelete}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                    Supprimer
                </button>
            </div>
        </div>
    )
}
