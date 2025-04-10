'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { Toaster, toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
    const { cart, removeFromCart, updateQuantity, calculateTotal, submitOrder, processing } = useCart()
    const { isAuthenticated, user } = useAuth()
    const router = useRouter()
    
    // États pour les entrées du formulaire
    const [step, setStep] = useState(1) // 1: Panier, 2: Livraison, 3: Paiement
    
    // Informations de livraison
    const [deliveryInfo, setDeliveryInfo] = useState({
        street: '',
        city: '',
        postalCode: '',
        country: 'France',
        notes: ''
    })
    
    // Informations de paiement
    const [paymentInfo, setPaymentInfo] = useState({
        cardName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    })
    
    // Fonctions pour traiter les changements de formulaire
    const handleDeliveryChange = (e) => {
        const { name, value } = e.target
        setDeliveryInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handlePaymentChange = (e) => {
        const { name, value } = e.target
        setPaymentInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    // Fonction pour passer à l'étape suivante
    const nextStep = () => {
        // Si l'utilisateur n'est pas connecté et veut passer au-delà du panier
        if (step === 1 && !isAuthenticated()) {
            toast.error("Veuillez vous connecter pour continuer")
            router.push('/login')
            return
        }
        
        // Validation des champs pour l'étape de livraison
        if (step === 2) {
            if (!deliveryInfo.street || !deliveryInfo.city || !deliveryInfo.postalCode) {
                toast.error("Veuillez remplir tous les champs obligatoires")
                return
            }
        }
        
        setStep(prev => prev + 1)
    }
    
    // Fonction pour retourner à l'étape précédente
    const prevStep = () => {
        setStep(prev => prev - 1)
    }
    
    // Fonction pour soumettre la commande
    const handleSubmitOrder = async (e) => {
        e.preventDefault()
        
        // Validation du formulaire de paiement
        if (!paymentInfo.cardName || !paymentInfo.cardNumber || !paymentInfo.expiryMonth || 
            !paymentInfo.expiryYear || !paymentInfo.cvv) {
            toast.error("Veuillez remplir tous les champs de paiement")
            return
        }
        
        // Validation basique du numéro de carte
        if (paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
            toast.error("Numéro de carte invalide")
            return
        }
        
        // Validation basique du CVV
        if (paymentInfo.cvv.length < 3) {
            toast.error("Code CVV invalide")
            return
        }
        
        // Soumettre la commande
        const result = await submitOrder(paymentInfo, deliveryInfo)
        
        if (result.success) {
            // Redirection gérée dans la fonction submitOrder
        }
    }

    // Calculer le sous-total (sans frais de livraison)
    const subtotal = calculateTotal(false)
    
    // Afficher un message si le panier est vide
    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#f8f8f8] px-6 py-10">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">🛒 Votre panier</h2>
                    <p className="text-gray-500 mb-6">Votre panier est actuellement vide.</p>
                    <Link href="/restaurants">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md shadow">
                            Parcourir les restaurants
                        </button>
                    </Link>
                </div>
                <Toaster position="top-center" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f8f8f8] px-6 py-10">
            <Toaster position="top-center" />
            
            {/* Étapes de commande */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <div className={`flex flex-col items-center ${step >= 1 ? 'text-orange-500' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                        <span className="text-xs font-medium">Panier</span>
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                    <div className={`flex flex-col items-center ${step >= 2 ? 'text-orange-500' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                        <span className="text-xs font-medium">Livraison</span>
                    </div>
                    <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                    <div className={`flex flex-col items-center ${step >= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                        <span className="text-xs font-medium">Paiement</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Étape 1: Récapitulatif du panier */}
                {step === 1 && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">🛒 Votre commande</h2>
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
                                                    src={item.imageUrl || "/pizza.png"}
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
                                <span className="font-semibold">{subtotal.toFixed(2)} €</span>
                            </p>
                            <p>
                                Livraison : <span className="font-semibold">3.50 €</span>
                            </p>
                            <p className="text-lg font-bold">
                                Total : {calculateTotal().toFixed(2)} €
                            </p>
                        </div>
                        
                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={nextStep}
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow"
                            >
                                Continuer vers la livraison
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Étape 2: Informations de livraison */}
                {step === 2 && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">🚚 Informations de livraison</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse*</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={deliveryInfo.street}
                                    onChange={handleDeliveryChange}
                                    placeholder="Numéro et nom de rue"
                                    className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ville*</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={deliveryInfo.city}
                                    onChange={handleDeliveryChange}
                                    placeholder="Ville"
                                    className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Code postal*</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={deliveryInfo.postalCode}
                                    onChange={handleDeliveryChange}
                                    placeholder="Code postal"
                                    className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions de livraison</label>
                                <textarea
                                    name="notes"
                                    value={deliveryInfo.notes}
                                    onChange={handleDeliveryChange}
                                    placeholder="Instructions pour le livreur (code d'entrée, étage, etc.)"
                                    className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200 h-24"
                                ></textarea>
                            </div>
            </div>

                        <div className="mt-8 flex justify-between">
                            <button 
                                onClick={prevStep}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-md"
                            >
                                Retour au panier
                            </button>
                            <button 
                                onClick={nextStep}
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow"
                            >
                                Continuer vers le paiement
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Étape 3: Paiement */}
                {step === 3 && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <form onSubmit={handleSubmitOrder}>
                <div className="mb-6">
                    <p className="text-sm text-gray-400">Paiement sécurisé</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">💳 Paiement</h2>
                </div>

                <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte*</label>
                    <input
                        type="text"
                                        name="cardName"
                                        value={paymentInfo.cardName}
                                        onChange={handlePaymentChange}
                        placeholder="Nom sur la carte"
                                        className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200"
                                        required
                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte*</label>
                    <input
                        type="text"
                                        name="cardNumber"
                                        value={paymentInfo.cardNumber}
                                        onChange={handlePaymentChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200"
                                        required
                                    />
                                </div>
                                
                                <div className="flex gap-4">
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mois*</label>
                                        <select
                                            name="expiryMonth"
                                            value={paymentInfo.expiryMonth}
                                            onChange={handlePaymentChange}
                                            className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200"
                                            required
                                        >
                                            <option value="">Mois</option>
                            {[...Array(12)].map((_, i) => (
                                                <option key={i} value={String(i + 1).padStart(2, '0')}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </option>
                            ))}
                        </select>
                                    </div>
                                    
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Année*</label>
                                        <select
                                            name="expiryYear"
                                            value={paymentInfo.expiryYear}
                                            onChange={handlePaymentChange}
                                            className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200"
                                            required
                                        >
                                            <option value="">Année</option>
                            {[...Array(10)].map((_, i) => (
                                                <option key={i} value={2024 + i}>
                                                    {2024 + i}
                                                </option>
                            ))}
                        </select>
                                    </div>
                                    
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV*</label>
                        <input
                            type="text"
                                            name="cvv"
                                            value={paymentInfo.cvv}
                                            onChange={handlePaymentChange}
                                            placeholder="123"
                                            maxLength="4"
                                            className="w-full p-3 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 border border-gray-200"
                                            required
                                        />
                                    </div>
                                </div>
                    </div>

                            {/* Résumé de la commande */}
                            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold mb-2">Résumé de la commande</h3>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Sous-total:</span>
                                    <span>{subtotal.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Frais de livraison:</span>
                                    <span>3.50 €</span>
                                </div>
                                <div className="flex justify-between font-bold mt-2 text-base">
                                    <span>Total:</span>
                                    <span>{calculateTotal().toFixed(2)} €</span>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button 
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-md"
                                >
                                    Retour à la livraison
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className={`px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow flex items-center gap-2 ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Traitement en cours...
                                        </>
                                    ) : (
                                        'Confirmer la commande'
                                    )}
                    </button>
                </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
