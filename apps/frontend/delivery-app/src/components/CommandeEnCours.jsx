'use client'

import React from 'react'
import { Phone, MapPin, CheckCircle2 } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import the map to avoid SSR issues
const MapWithDirections = dynamic(() => import('./Map'), {
    ssr: false,
})

export default function CommandeEnCours({ commande, onUpdateStatus }) {
    if (!commande?.id) {
        return <div className="p-6 text-gray-500 italic">Chargement de la commande...</div>
    }

    return (
        <div className="p-8 bg-[#f9f9f9] min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">🚚 Commande en cours</h2>

                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                    {/* En-tête */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-lg font-semibold text-gray-800">Commande #{commande.id}</p>
                            <p className="text-sm text-gray-600">{commande.status}</p>
                            <p className="text-sm text-orange-600">⏱️ Temps estimé : {commande.eta}</p>
                        </div>
                        <span className="text-sm bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-medium">
                            {commande.status}
                        </span>
                    </div>

                    {/* Grille infos + map */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Infos */}
                        <div className="space-y-6">
                            <Section title="🍔 Détails de la commande">
                                <Info label="Restaurant" value={commande.restaurant} />
                                <Info label="Adresse" value={commande.restaurantAdresse} icon={<MapPin size={16} />} />
                                <Info label="Commande" value={commande.items} />
                                <Info label="Prix total" value={`${commande.total} €`} />
                            </Section>

                            <Section title="👤 Client">
                                <Info label="Nom" value={commande.client.nom} />
                                <Info label="Adresse" value={commande.client.adresse} icon={<MapPin size={16} />} />
                                <Info label="Téléphone" value={commande.client.tel} icon={<Phone size={16} />} />
                            </Section>

                            <Section title="💰 Rémunération">
                                <Info label="Revenu" value={`${commande.revenu} €`} />
                            </Section>
                        </div>

                        {/* Carte avec Directions */}
                        <div className="rounded-xl overflow-hidden shadow-sm h-[300px]">
                            <MapWithDirections />
                        </div>
                    </div>

                    {/* Bouton */}
                    <div className="flex justify-center pt-2">
                        <button
                            onClick={onUpdateStatus}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow transition"
                        >
                            <CheckCircle2 size={18} />
                            Mettre à jour le statut
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Section({ title, children }) {
    return (
        <div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
            <div className="space-y-1">{children}</div>
        </div>
    )
}

function Info({ label, value, icon }) {
    return (
        <p className="text-sm text-gray-700 flex items-center gap-2">
            {icon && <span className="text-gray-500">{icon}</span>}
            <span className="font-medium">{label} :</span> {value}
        </p>
    )
}
