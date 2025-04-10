'use client'

import Link from 'next/link'
import React from 'react'

export default function LivreurInfo() {
    // 👤 Données fictives du livreur connecté
    const livreur = {
        nom: 'Jean Dupont',
        email: 'jean.dupont@livreur.com',
        adresse: {
            rue: '1 rue de la Poste',
            ville: 'Orléans',
            codePostal: '45000',
            pays: 'France',
        },
        disponibilites: [
            { jour: 'Lundi', horaires: ['08:00 - 12:00', '14:00 - 18:00'] },
            { jour: 'Mardi', horaires: ['09:00 - 17:00'] },
            { jour: 'Mercredi', horaires: [] },
            { jour: 'Jeudi', horaires: ['08:00 - 12:00'] },
            { jour: 'Vendredi', horaires: ['09:00 - 12:00', '13:30 - 19:00'] },
            { jour: 'Samedi', horaires: ['10:00 - 14:00'] },
            { jour: 'Dimanche', horaires: [] },
        ],
    }

    return (
        <div className="bg-[#f9f9f9] min-h-screen px-6 py-12 w-full">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header + bouton modifier */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">👤 Mon profil</h1>
                    <Link
                        href="/parametres/edit"
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-full transition shadow"
                    >
                        Modifier
                    </Link>
                </div>

                {/* Infos personnelles */}
                <Card title="📄 Informations Personnelles">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Info label="Nom" value={livreur.nom} />
                        <Info label="Email" value={livreur.email} />
                    </div>
                </Card>

                {/* Adresse */}
                <Card title="📍 Adresse">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Info label="Rue" value={livreur.adresse.rue} />
                        <Info label="Ville" value={livreur.adresse.ville} />
                        <Info label="Code Postal" value={livreur.adresse.codePostal} />
                        <Info label="Pays" value={livreur.adresse.pays} />
                    </div>
                </Card>

                {/* Disponibilités */}
                <Card title="📅 Disponibilités">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Jour</th>
                                    <th scope="col" className="px-4 py-3">Horaires</th>
                                </tr>
                            </thead>
                            <tbody>
                                {livreur.disponibilites.map(({ jour, horaires }, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-4 py-3 font-medium">{jour}</td>
                                        <td className="px-4 py-3 space-x-2 flex flex-wrap">
                                            {horaires.length > 0 ? (
                                                horaires.map((horaire, i) => (
                                                    <span
                                                        key={i}
                                                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium"
                                                    >
                                                        {horaire}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 italic">Aucune disponibilité</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}

// Composant de section
function Card({ title, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
            {children}
        </div>
    )
}

// Affichage de champ label + valeur
function Info({ label, value }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-base font-medium text-gray-800 mt-1">{value}</p>
        </div>
    )
}
