"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // Charger le panier depuis localStorage uniquement si nous sommes dans le navigateur
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return []; // Retourner un tableau vide si nous ne sommes pas dans le navigateur
    });
    
    const [processing, setProcessing] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const router = useRouter();

    const { registerLogoutCallback, isAuthenticated, user } = useAuth();

    const clearCart = useCallback(() => {
        setCart([]);
        if (typeof window !== "undefined") {
            localStorage.removeItem('cart');
        }
    }, []);

    useEffect(() => {
        // S'enregistrer pour le callback de déconnexion
        const unregister = registerLogoutCallback(clearCart);
        return () => {
            // Nettoyer le callback lors du démontage du composant
            unregister();
        };
    }, [registerLogoutCallback, clearCart]);

    useEffect(() => {
        // Sauvegarder le panier dans localStorage chaque fois qu'il change
        if (typeof window !== "undefined") {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        
        // Afficher une notification de confirmation
        toast.success(`${product.name} ajouté au panier`);
    }

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== productId));
    }

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    }
    
    const calculateTotal = (includeDelivery = true) => {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const deliveryFee = includeDelivery ? 3.5 : 0;
        return subtotal + deliveryFee;
    }
    
    const getRestaurantId = () => {
        // Si tous les éléments du panier viennent du même restaurant, retourner son ID
        if (cart.length > 0 && cart[0].restaurantId) {
            return cart[0].restaurantId;
        }
        return null;
    }
    
    const submitOrder = async (paymentInfo, deliveryAddress) => {
        // Vérifier si l'utilisateur est connecté
        if (!isAuthenticated()) {
            setOrderError("Vous devez être connecté pour passer une commande");
            toast.error("Vous devez être connecté pour passer une commande");
            router.push('/login');
            return { success: false, error: "Authentification requise" };
        }

        // Vérifier si le panier n'est pas vide
        if (cart.length === 0) {
            setOrderError("Votre panier est vide");
            toast.error("Impossible de passer une commande avec un panier vide");
            return { success: false, error: "Panier vide" };
        }

        // Générer un ID de commande unique
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        setProcessing(true);
        setOrderError(null);
        
        try {
            // Préparer les données de la commande au format attendu par l'API
            const orderData = {
                order_id: orderId,
                client_id: user?.id,
                restaurant_id: getRestaurantId(),
                items: cart.map(item => ({
                    dish_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total_price: calculateTotal(),
                status: 'validated_by_client',
                comments: deliveryAddress.notes || '',
                delivery_address: {
                    street: deliveryAddress.street,
                    city: deliveryAddress.city,
                    postalCode: deliveryAddress.postalCode,
                    country: deliveryAddress.country || 'France'
                },
                payment_info: {
                    card_type: paymentInfo.cardType || 'credit_card',
                    last_four: paymentInfo.cardNumber.slice(-4),
                    payment_status: 'completed'
                }
            };
            
            console.log("Envoi de la commande:", orderData);
            
            // Envoyer la commande au service d'ordre
            const response = await fetch(`${process.env.NEXT_PUBLIC_ORDER_API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Erreur lors de la création de la commande");
            }
            
            const responseData = await response.json();
            
            // Vider le panier après une commande réussie
            clearCart();
            
            // Rediriger vers la page de confirmation
            router.push(`/order-confirm?id=${responseData._id || orderId}`);
            toast.success("Commande validée avec succès !");
            
            return { success: true, order: responseData };
        } catch (error) {
            console.error("Erreur lors de la création de la commande:", error);
            setOrderError(error.message);
            toast.error(error.message || "Une erreur est survenue lors de la validation de votre commande");
            return { success: false, error: error.message };
        } finally {
            setProcessing(false);
        }
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart,
            calculateTotal,
            submitOrder,
            processing,
            orderError,
            getRestaurantId
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)