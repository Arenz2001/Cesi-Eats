'use client'

import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Package, Check, Truck, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const OrderConfirmation = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        
        // Si aucun ID de commande n'est fourni, rediriger vers la page d'accueil
        if (!orderId) {
            router.push('/');
            return;
        }
        
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/${orderId}`);
                
                if (!response.ok) {
                    throw new Error('Commande non trouvée');
                }
                
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error('Erreur lors de la récupération de la commande:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrderDetails();
    }, [orderId, isAuthenticated, router]);
    
    // État de chargement
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600">Chargement de votre commande...</p>
                </div>
            </div>
        );
    }
    
    // Affichage en cas d'erreur
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="mb-4 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href="/">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md shadow font-medium">
                            Retour à l'accueil
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
    
    // Si la commande n'existe pas
    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Commande introuvable</h2>
                    <p className="text-gray-600 mb-6">La commande que vous recherchez n'existe pas ou a été supprimée.</p>
                    <Link href="/">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md shadow font-medium">
                            Retour à l'accueil
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen px-6 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Bannière de confirmation */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <Check className="text-green-600" size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-green-800">Commande confirmée !</h1>
                        <p className="text-green-600">
                            Votre commande #{order.order_id} a été reçue et est en cours de traitement.
                        </p>
                    </div>
                </div>
                
                {/* Suivi de commande */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-lg font-bold mb-4 flex items-center">
                        <Clock className="mr-2 text-orange-500" size={20} />
                        État de la commande
                    </h2>
                    
                    <div className="relative">
                        {/* Ligne de progression */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        {/* Étapes */}
                        <div className="space-y-8 relative">
                            <div className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center z-10">
                                    <Check size={16} />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold">Commande validée</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${order.status === 'accepted_by_restaurant' || order.status === 'in_preparation' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {order.status === 'accepted_by_restaurant' || order.status === 'in_preparation' ? <Check size={16} /> : '2'}
                                </div>
                                <div className="ml-4">
                                    <h3 className={`font-semibold ${order.status === 'accepted_by_restaurant' || order.status === 'in_preparation' ? 'text-gray-800' : 'text-gray-400'}`}>
                                        Préparation en cuisine
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {order.status === 'accepted_by_restaurant' || order.status === 'in_preparation' ? 'En cours de préparation' : 'En attente'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${order.status === 'accepted_by_delivery' || order.status === 'on_the_way' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {order.status === 'accepted_by_delivery' || order.status === 'on_the_way' ? <Check size={16} /> : '3'}
                                </div>
                                <div className="ml-4">
                                    <h3 className={`font-semibold ${order.status === 'accepted_by_delivery' || order.status === 'on_the_way' ? 'text-gray-800' : 'text-gray-400'}`}>
                                        Livraison en cours
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {order.status === 'on_the_way' ? 'Votre commande est en route' : 'En attente'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${order.status === 'delivered' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {order.status === 'delivered' ? <Check size={16} /> : '4'}
                                </div>
                                <div className="ml-4">
                                    <h3 className={`font-semibold ${order.status === 'delivered' ? 'text-gray-800' : 'text-gray-400'}`}>
                                        Livré
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {order.status === 'delivered' ? 'Commande livrée avec succès' : 'À venir'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Détails de la commande */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Récapitulatif des produits */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center">
                            <Package className="mr-2 text-orange-500" size={20} />
                            Produits commandés
                        </h2>
                        
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-4 text-orange-500 font-bold">
                                        {item.quantity}×
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-medium">{item.dish_name || item.dish_id}</h3>
                                        <p className="text-sm text-gray-500">
                                            {item.price.toFixed(2)} € par unité
                                        </p>
                                    </div>
                                    <div className="font-semibold">
                                        {(item.price * item.quantity).toFixed(2)} €
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Sous-total</span>
                                <span className="font-medium">{(order.total_price - 3.5).toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Frais de livraison</span>
                                <span className="font-medium">3.50 €</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold mt-2">
                                <span>Total</span>
                                <span>{order.total_price.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Infos de livraison */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center">
                            <Truck className="mr-2 text-orange-500" size={20} />
                            Livraison
                        </h2>
                        
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Adresse de livraison</h3>
                            <div className="flex items-start">
                                <MapPin className="text-gray-400 mt-0.5 mr-1 flex-shrink-0" size={16} />
                                <p className="text-sm">
                                    {order.delivery_address?.street}<br />
                                    {order.delivery_address?.postalCode} {order.delivery_address?.city}<br />
                                    {order.delivery_address?.country || 'France'}
                                </p>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Restaurant</h3>
                            <p className="text-sm">{order.restaurant_name || "Restaurant partenaire"}</p>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Livreur</h3>
                            <p className="text-sm">
                                {order.status === 'accepted_by_delivery' || order.status === 'on_the_way' ? 
                                    `${order.delivery_person_name || "Votre livreur"}` : 
                                    "En attente d'attribution"
                                }
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Bouton pour retourner aux commandes */}
                <div className="mt-8 text-center">
                    <Link href="/orders" className="inline-block bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-lg shadow-md font-medium transition-colors">
                        Voir toutes mes commandes
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;