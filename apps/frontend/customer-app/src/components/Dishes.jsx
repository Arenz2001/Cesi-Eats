"use client"
import React from "react";
import Image from "next/image";
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

const Dish = ({ dish }) => {
    const { id, name, desc, price, likes, imageUrl } = dish
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        console.log("added to cart", dish)
        addToCart(dish);
        toast.success(`${name} ajouté au panier`);
    }
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-center"> {/* Ajout de flex et justify-center ici */}
                <Image className="" src={imageUrl} alt="plats" width={250} height={250} />
            </div>
            <h3 className="font-bold pt-4">{name}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
            <div className="flex justify-between items-center mt-2">
                <span className="font-bold">💲{price}</span>
                {likes && <span className="flex items-center gap-1">❤️ {likes}</span>}

            </div>
            <button
                onClick={handleAddToCart}
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600 transition-colors"
            >
                Ajouter au panier
            </button>
        </div>
    );
};

export default Dish;
