'use client'

import React from 'react'
import { useCart } from '@/context/CartContext'

export default function CheckoutPage() {
    const { cart, removeFromCart, updateQuantity } = useCart()

    const calculateSousTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    }

    const calculateTotal = () => {
        const shippingCost = 3.5
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
        return (subtotal + shippingCost).toFixed(2)
    }

    return (
        <div className="min-h-screen bg-[#f8f8f8] px-6 py-10 flex flex-col lg:flex-row gap-8">
            {/* Récapitulatif commande */}
            <div className="flex-1 bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">🛒 Votre commande</h2>

                {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm">Votre panier est vide.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b">
                                        <th className="pb-3">Produit</th>
                                        <th className="pb-3">Quantité</th>
                                        <th className="pb-3">Prix</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.id} className="border-b last:border-none">
                                            <td className="py-4 flex items-center gap-4">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-14 h-14 object-cover rounded"
                                                />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.description}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
                                                    >
                                                        −
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-gray-700">
                                                        {(item.price * item.quantity).toFixed(2)} €
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-red-500 hover:text-red-600 font-bold text-lg"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Total */}
                        <div className="text-right mt-6 space-y-1 text-sm text-gray-700">
                            <p>
                                Sous-total :{' '}
                                <span className="font-semibold">{calculateSousTotal()} €</span>
                            </p>
                            <p>
                                Livraison : <span className="font-semibold">3.50 €</span>
                            </p>
                            <p className="text-lg font-bold">
                                Total : {calculateTotal()} €
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Paiement */}
            <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-md p-6">
                <div className="mb-6">
                    <p className="text-sm text-gray-400">Paiement sécurisé</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">💳 Paiement</h2>
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nom sur la carte"
                        className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <input
                        type="text"
                        placeholder="Numéro de carte"
                        className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <div className="flex gap-2">
                        <select className="flex-1 p-3 rounded-md bg-gray-100 text-gray-700">
                            <option>Mois</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i}>{String(i + 1).padStart(2, '0')}</option>
                            ))}
                        </select>
                        <select className="flex-1 p-3 rounded-md bg-gray-100 text-gray-700">
                            <option>Année</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i}>{2024 + i}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="CVV"
                            className="w-20 p-3 rounded-md bg-gray-100"
                        />
                    </div>

                    <button className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow">
                        Confirmer le paiement
                    </button>
                </div>
            </div>
        </div>
    )
}
