'use client'

import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react' // Icône moderne

export default function CommandesDispoTable() {
    const [search, setSearch] = useState('')

    const commandes = [
        { id: '12345', client: 'Alice Johnson', adresse: '123 Elm Street', status: 'Disponible' },
        { id: '12346', client: 'Bob Marley', adresse: '456 Pine Avenue', status: 'Disponible' },
        { id: '12347', client: 'Charlie Brown', adresse: '789 Oak Drive', status: 'Disponible' },
        { id: '12348', client: 'Dylan Thomas', adresse: '12 Rue de Paris', status: 'Disponible' },
    ]

    const filtered = commandes.filter(
        (cmd) =>
            cmd.id.toLowerCase().includes(search.toLowerCase()) ||
            cmd.client.toLowerCase().includes(search.toLowerCase()) ||
            cmd.adresse.toLowerCase().includes(search.toLowerCase())
    )

    const handleValidate = (id) => {
        console.log('Commande validée :', id)
    }

    return (
        <div className="p-8 bg-[#f9f9f9] min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📦 Commandes disponibles</h2>

            {/* Recherche */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="🔍 Rechercher par client, adresse, numéro..."
                    className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Tableau */}
            <div className="overflow-auto">
                <table className="w-full table-auto text-sm bg-white rounded-xl overflow-hidden shadow-md">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4 text-left">N°</th>
                            <th className="px-6 py-4 text-left">Client</th>
                            <th className="px-6 py-4 text-left">Adresse</th>
                            <th className="px-6 py-4 text-left">Statut</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((cmd) => (
                            <tr
                                key={cmd.id}
                                className="border-t hover:bg-orange-50 transition duration-150"
                            >
                                <td className="px-6 py-4 font-medium text-gray-800">{cmd.id}</td>
                                <td className="px-6 py-4">{cmd.client}</td>
                                <td className="px-6 py-4">{cmd.adresse}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                                        {cmd.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => handleValidate(cmd.id)}
                                        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-full shadow-sm transition"
                                    >
                                        <CheckCircle size={16} /> Valider
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center p-6 text-gray-500 italic">
                                    Aucune commande trouvée...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
