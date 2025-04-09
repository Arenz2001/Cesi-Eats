'use client'

import Image from 'next/image'
import categoriesList from '../models/categories'
import Categories from '@/components/Categories'
import { useEffect, useState } from 'react'

export default function HomePage() {


    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-24 py-16 gap-8">
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-snug max-w-xl mx-auto lg:mx-0">
                        Découvrez les meilleurs restaurants près de chez vous 🍽️
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                        <input
                            type="text"
                            placeholder="Trouvez votre restaurant favori"
                            className="border border-gray-300 rounded-md px-4 py-3 w-full sm:w-[400px] focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md text-sm font-medium">
                            Rechercher
                        </button>
                    </div>
                </div>

                <div className="flex justify-center flex-1">
                    <Image
                        src="/accueil.png"
                        alt="Livreur"
                        width={350}
                        height={350}
                        className="object-contain"
                    />
                </div>
            </section>

            {/* Catégories */}
            <section className="px-6 lg:px-24 py-12 bg-[#fff7ea] text-center">
                <h2 className="text-3xl font-bold mb-8">Nos catégories</h2>
                <div className="flex flex-wrap gap-6 justify-center">
                    {categoriesList.map((category, index) => (
                        <Categories
                            key={index}
                            name={category.name}
                            image={category.image}
                            onClick={() => {
                                window.location.href = `/restaurants?category=${category.name}`;
                            }}
                        />
                    ))}
                </div>
            </section>

            {/* Offres + Contenu */}
            <div className="flex flex-col lg:flex-row gap-6 px-6 lg:px-24 py-12">
                {/* Sidebar */}
                <aside className="lg:w-1/4 space-y-6">
                    <SpecialOffer
                        title="Spécialités pizzas"
                        discount="20% OFF"
                        cta="Acheter maintenant"
                    />
                    <SpecialOffer
                        title="Nouvelle alerte menu"
                        discount="20% OFF"
                        cta="Acheter maintenant"
                    />
                    <div className="bg-orange-500 text-white text-center p-6 rounded-xl shadow-lg">
                        <h3 className="font-bold text-lg">🎉 PROMOTIONS</h3>
                        <p className="text-sm">Offre à durée limitée</p>
                        <span className="text-3xl font-bold mt-2 block">10:57</span>
                    </div>
                </aside>

                {/* Contenu principal */}
                <main className="flex-1 space-y-12">
                    {/* Restaurants populaires */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">🍴 Restaurants populaires</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {["Pizza", "Burger", "Sushi", "Salade", "Mamma Mia!", "Tacos"].map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition"
                                >
                                    <div className="h-32 bg-gray-200 rounded-md mb-2" />
                                    <h3 className="font-semibold text-gray-800">{item}</h3>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Plats populaires */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">🍛 Plats populaires</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {["Steakhouse specials", "Vegetarian delights"].map((item, index) => (
                                <div
                                    key={index}
                                    className="relative bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition"
                                >
                                    <div className="h-40 bg-gray-200 rounded-md mb-3" />
                                    <h3 className="font-semibold text-gray-800 mb-4">{item}</h3>
                                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm font-medium">
                                        Acheter maintenant
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

function SpecialOffer({ title, discount, cta }) {
    return (
        <div className="bg-orange-100 p-4 rounded-xl shadow text-center">
            <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
            <span className="block text-orange-600 font-bold text-lg">{discount}</span>
            <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition">
                {cta}
            </button>
        </div>
    )
}