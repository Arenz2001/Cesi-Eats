"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Clock, MapPin, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Page() {
    const { isAuthenticated, user, accessToken } = useAuth();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [orderError, setOrderError] = useState(null);

    useEffect(() => {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        // Charger les informations détaillées de l'utilisateur depuis le service client
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_CUSTOMER_API_URL}/api/users/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (response.ok) {
                    const profileData = await response.json();
                    setUserProfile(profileData);
                } else {
                    console.error('Erreur lors de la récupération du profil utilisateur');
                }
            } catch (error) {
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserOrders = async () => {
            if (!user?.id) return;
            
            try {
                setLoadingOrders(true);
                // Utiliser le bon endpoint pour récupérer les commandes d'un client
                const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders/client/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                if (response.ok) {
                    const ordersData = await response.json();
                    console.log('Commandes récupérées:', ordersData);
                    
                    // Trier par date, du plus récent au plus ancien
                    ordersData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setOrders(ordersData);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Réponse d\'erreur:', errorData);
                    throw new Error(errorData.message || 'Erreur lors de la récupération des commandes');
                }
            } catch (error) {
                console.error('Erreur:', error);
                setOrderError(error.message);
                toast.error('Impossible de charger vos commandes. Veuillez réessayer plus tard.');
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchUserProfile();
        fetchUserOrders();
    }, [isAuthenticated, router, user, accessToken]);

    // Fonction pour formater une date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Fonction pour afficher le statut en français
    const getStatusLabel = (status) => {
        const statusMap = {
            'validated_by_client': 'Commande validée',
            'accepted_by_restaurant': 'Acceptée par le restaurant',
            'in_preparation': 'En préparation',
            'accepted_by_delivery': 'Prise en charge par le livreur',
            'on_the_way': 'En cours de livraison',
            'delivered': 'Livrée',
            'cancelled': 'Annulée'
        };
        return statusMap[status] || status;
    };

    // Fonction pour obtenir la classe de couleur en fonction du statut
    const getStatusColorClass = (status) => {
        switch (status) {
            case 'validated_by_client':
                return 'bg-blue-100 text-blue-800';
            case 'accepted_by_restaurant':
                return 'bg-purple-100 text-purple-800';
            case 'in_preparation':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted_by_delivery':
                return 'bg-indigo-100 text-indigo-800';
            case 'on_the_way':
                return 'bg-orange-100 text-orange-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-2 text-gray-700">Chargement de votre profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-full max-w-xs bg-white p-6 border-r">
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-bold">
                        {userProfile ? `${userProfile.FirstName} ${userProfile.LastName}` : user?.email}
                    </h2>
                    <p className="text-sm text-gray-600 hover:underline">
                        {user?.email}
                    </p>
                    {userProfile && (
                        <p className="text-sm text-gray-600 mt-1">
                            Tél: {userProfile.PhoneNumber}
                        </p>
                    )}
                </div>

                <nav className="mt-10 space-y-4 text-sm">
                    <p><Link href="/profil" className="text-black font-semibold">Historique de Commandes</Link></p>
                    <p><Link href="/profil-param" className="text-gray-600 hover:text-black cursor-pointer">Paramètres</Link></p>
                    <p><button 
                        onClick={() => useAuth().logout()}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                        Déconnexion
                    </button></p>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10">
                <h1 className="text-2xl font-bold mb-6">Historique de Commandes</h1>
                
                {loadingOrders ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                        <p className="ml-3 text-gray-600">Chargement de vos commandes...</p>
                    </div>
                ) : orderError ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                        <p>Erreur lors du chargement des commandes: {orderError}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <Package size={40} className="mx-auto mb-3 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune commande trouvée</h3>
                        <p className="text-gray-500 mb-4">Vous n'avez pas encore passé de commande.</p>
                        <Link href="/restaurants">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md shadow font-medium">
                                Découvrir nos restaurants
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <div key={index} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Commande #{order.order_id}</p>
                                        <p className="font-bold text-lg">{formatDate(order.created_at)}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColorClass(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-4 mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-2 mb-2">
                                            <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium">Livré à</p>
                                                <p className="text-sm text-gray-600">
                                                    {order.delivery_address?.street || 'Adresse non disponible'}
                                                    {order.delivery_address?.postalCode && `, ${order.delivery_address.postalCode}`}
                                                    {order.delivery_address?.city && ` ${order.delivery_address.city}`}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-2">
                                            <Package size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium">Commande</p>
                                                <p className="text-sm text-gray-600">
                                                    {order.items && order.items.length > 0 
                                                        ? `${order.items.reduce((total, item) => total + (item.quantity || 1), 0)} article(s)`
                                                        : 'Détails non disponibles'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="md:text-right">
                                        <p className="text-sm font-medium">Total</p>
                                        <p className="text-lg font-bold text-orange-600">
                                            {order.total_price ? `${order.total_price.toFixed(2)} €` : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                
                                <Link href={`/order-confirm?id=${order._id}`}>
                                    <button className="w-full mt-2 flex items-center justify-center gap-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition">
                                        Voir les détails
                                        <ChevronRight size={16} />
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
