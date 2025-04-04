"use client";
import React from "react";
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
    const { cart, removeFromCart, updateQuantity } = useCart();

    const calculateSousTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };
    const calculateTotal = () => {
        const shippingCost = 3.50; // Coût de livraison
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        return (subtotal + shippingCost).toFixed(2); // Ajoutez les frais de livraison au sous-total
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen bg-gray-50">
            {/* Order Summary */}
            <div className="flex-1 bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-bold mb-6">Details de la commande</h2>
                {cart.length === 0 ? (
                    <p>Votre panier est vide.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-left text-sm text-gray-600">
                                    <th>Product</th>
                                    <th>Quantité</th>
                                    <th>Prix</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id} className="bg-gray-100 rounded">
                                        <td className="flex items-center gap-4 p-2">
                                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded object-cover" />
                                            <div>
                                                <p className="font-medium text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.description}</p>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="bg-gray-300 px-2 rounded"
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="bg-gray-300 px-2 rounded"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div className="flex items-center space-x-4">
                                                <span className="font-semibold">${item.price}</span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-right mt-6 space-y-1 text-sm">
                            <p>Sous-total: <span className="font-semibold">${calculateSousTotal()}</span></p>
                            <p>Livraison: <span className="font-semibold">$3.50</span></p>
                            <p className="text-lg font-bold">Total: ${calculateTotal()}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Section */}
            <div className="w-full lg:w-1/3 bg-orange-400 p-6 rounded-xl text-white shadow">
                <div className="mb-6">
                    <p className="text-sm">← Validation de la commande</p>
                    <h2 className="text-2xl font-bold mt-2">Informations de paiement</h2>
                </div>

                <button className="bg-black text-white py-2 px-4 rounded mb-4">Carte bancaire</button>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nom sur la carte"
                        defaultValue=""
                        className="w-full p-2 rounded bg-white text-black"
                    />
                    <input
                        type="text"
                        placeholder="Numéros de carte"
                        defaultValue=""
                        className="w-full p-2 rounded bg-white text-black"
                    />
                    <div className="flex gap-2">
                        <select className="flex-1 p-2 rounded bg-white text-black">
                            <option>MM</option>
                        </select>
                        <select className="flex-1 p-2 rounded bg-white text-black">
                            <option>YYYY</option>
                        </select>
                        <input
                            type="text"
                            placeholder="CVV"
                            className="w-16 p-2 rounded bg-white text-black"
                        />
                    </div>
                    <button className="w-full mt-4 py-3 bg-black text-white font-semibold rounded">
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
}
