'use client'

import Link from 'next/link'

export default function RestaurateurParametres() {
    const restaurant = {
        nom: 'KFC Orléans',
        email: 'contact@kfc-orleans.fr',
        adresse: {
            rue: '123 Rue de la Volaille',
            ville: 'Orléans',
            codePostal: '45000',
            pays: 'France',
        },
        horaires: [
            { jour: 'Lundi - Vendredi', plages: ['11:00 - 14:00', '18:00 - 22:00'] },
            { jour: 'Samedi', plages: ['11:00 - 23:00'] },
            { jour: 'Dimanche', plages: ['11:00 - 21:00'] },
        ],
    }

    return (
        <div className="bg-[#f9f9f9] min-h-screen px-6 py-12 w-full">
            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header + bouton modifier */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">🏪 Paramètres du restaurant</h1>
                    <Link
                        href="/parametres/edit"
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-full transition shadow"
                    >
                        Modifier
                    </Link>
                </div>

                {/* Infos générales */}
                <Card title="📄 Informations générales">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Info label="Nom" value={restaurant.nom} />
                        <Info label="Email" value={restaurant.email} />
                    </div>
                </Card>

                {/* Adresse */}
                <Card title="📍 Adresse">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Info label="Rue" value={restaurant.adresse.rue} />
                        <Info label="Ville" value={restaurant.adresse.ville} />
                        <Info label="Code Postal" value={restaurant.adresse.codePostal} />
                        <Info label="Pays" value={restaurant.adresse.pays} />
                    </div>
                </Card>

                {/* Horaires */}
                <Card title="⏰ Heures d’ouverture">
                    <div className="space-y-4">
                        {restaurant.horaires.map((jour, i) => (
                            <div key={i}>
                                <p className="font-semibold text-gray-800">{jour.jour}</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {jour.plages.map((plage, j) => (
                                        <span
                                            key={j}
                                            className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            {plage}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

function Card({ title, children }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
            {children}
        </div>
    )
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-base font-medium text-gray-800 mt-1">{value}</p>
        </div>
    )
}
