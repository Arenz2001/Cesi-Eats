'use client'

import React from 'react'

export default function Commandes() {
    const commandesEnAttente = [
        { id: '#6790', info: 'Reçue il y a 2min' },
        { id: '#6792', info: 'Reçue il y a 1min' },
        { id: '#6793', info: 'Reçue il y a 3min' },
        { id: '#6795', info: 'Reçue il y a 3min' },
        { id: '#6799', info: 'Reçue il y a 3min' },
    ]

    const commandesEnCours = [
        { id: '#6790', info: 'Acceptée il y a 5min' },
        { id: '#6791', info: 'Acceptée il y a 8min' },
    ]

    return (
        <div className="p-8 bg-[#fff7ea] min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <CommandeTableBlock
                    title="📥 Commandes en attente"
                    commandes={commandesEnAttente}
                    actionLabel="Accepter"
                    actionColor="bg-orange-500"
                    onAction={(id) => console.log('Accepter', id)}
                />

                <CommandeTableBlock
                    title="🚚 Commandes en cours"
                    commandes={commandesEnCours}
                    actionLabel="Modifier"
                    actionColor="bg-orange-400"
                    onAction={(id) => console.log('Modifier', id)}
                />
            </div>
        </div>
    )
}

function CommandeTableBlock({ title, commandes, actionLabel, actionColor, onAction }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
            <div className="overflow-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-4 py-2">Commande</th>
                            <th className="px-4 py-2">Statut</th>
                            <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commandes.map((cmd) => (
                            <tr key={cmd.id} className="border-b hover:bg-orange-50">
                                <td className="px-4 py-3 font-medium">{cmd.id}</td>
                                <td className="px-4 py-3">{cmd.info}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => onAction(cmd.id)}
                                        className={`text-white px-4 py-1 rounded-full text-sm ${actionColor} hover:brightness-110 transition`}
                                    >
                                        {actionLabel}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {commandes.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-4 py-3 text-center text-gray-400 italic">
                                    Aucune commande
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
