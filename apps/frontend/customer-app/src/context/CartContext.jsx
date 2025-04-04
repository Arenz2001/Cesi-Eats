"use client"
import { createContext, useContext, useState, useEffect } from "react";

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

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)