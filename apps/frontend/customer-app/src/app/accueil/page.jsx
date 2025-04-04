import React from 'react'
import Image from 'next/image'
import categoriesList from "../models/categories"
import Categories from '@/components/Categories'

export default function page() {
    return (
        <>
            <section className="flex flex-col items-center justify-center h-screen bg-white">
                <div className="text-center flex h-full">
                    <div className="w-2/3 h-full flex flex-col items-center justify-center pr-24">
                        <h1 className="text-4xl font-bold mb-4 w-3/4">
                            Découvrez les meilleurs restaurants près de chez vous
                        </h1>
                        <div className="flex items-center justify-center mb-4">
                            <input
                                type="text"
                                placeholder="Trouvez votre restaurant favori"
                                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 w-[500px] mr-2"
                            />

                            <button
                                type="submit"
                                className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors"
                            >
                                Rechercher
                            </button>
                        </div>
                    </div>
                    <div className=" w-1/3 m-auto items-center justify-center pl-12">
                        <Image src="/accueil.png" alt="Livreur" width={200} height={200} />
                    </div>
                </div>

            </section>
            <section className="flex flex-col items-center justify-center h-[50vh] bg-white">
                <div className="text-center  h-full">
                    <h1 className="text-3xl font-bold text-center mb-4">Categories</h1>
                    <div className=" flex items-center justify-center flex-wrap w-full">
                        {categoriesList.map((category, index) => (
                            <Categories key={index} name={category.name} image={category.image} />
                        ))}
                    </div>
                </div>
            </section>




            <div className="flex p-4  min-h-screen">
                {/* Sidebar */}
                <aside className="w-1/4 p-4 space-y-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-lg font-semibold">🍽️ Offres spéciales</h2>
                    <div className="bg-orange-100 p-4 rounded-lg text-center">
                        <h3 className="font-bold">Spécialités pizzas</h3>
                        <span className="block text-orange-500 font-bold text-lg">20% OFF</span>
                        <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded">Acheter maintenant</button>
                    </div>
                    <div className="bg-orange-100 p-4 rounded-lg text-center">
                        <h3 className="font-bold">Nouvelle alerte menu</h3>
                        <span className="block text-orange-500 font-bold text-lg">20% OFF</span>
                        <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded">Acheter maintenant</button>
                    </div>
                    <div className="bg-orange-500 text-white text-center p-4 rounded-lg">
                        <h3 className="font-bold">PROMOTIONS</h3>
                        <p>Offre à durée limitée</p>
                        <span className="text-2xl font-bold">10:57</span>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Restaurants populaires */}
                    <section>
                        <h2 className="text-xl font-bold mb-4">🍽️ Restaurants populaires</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {["Pizza", "Burger", "Sushi", "Salade", "Mamma Mia!", "Tacos"].map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                                    <div className="h-32 bg-gray-300 rounded-md"></div>
                                    <h3 className="mt-2 text-center font-semibold">{item}</h3>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Plats populaires */}
                    <section className="mt-6">
                        <h2 className="text-xl font-bold mb-4">🍽️ Plats populaires</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {["Steakhouse specials", "Vegetarian delights"].map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-lg text-center relative">
                                    <div className="h-40 bg-gray-300 rounded-md"></div>
                                    <h3 className="mt-2 font-semibold">{item}</h3>
                                    <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded">
                                        Acheter maintenant
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}
