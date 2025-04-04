import React from "react";
import Dish from "@/components/Dishes";


const dishes = [
    { name: "Gourmet", desc: "Un délicieux burger !", price: "12.9", imageUrl: "/lasagnes.jpg" },
    { name: "Spaghetti Marinara", desc: "Classic indémodable", price: "10.9", imageUrl: "/lasagnes.jpg" },
    { name: "Garden Salad", desc: "Pelouse tondue de la veille ! Donne un bon goût.", price: "8.9", imageUrl: "/lasagnes.jpg" },
];


const OrderConfirmation = () => {
    return (
        <>
            <div className="p-6 bg-gray-100 min-h-screen">
                <h2 className="font-bold text-xl mb-4">Confirmation de commande</h2>
                <div className="grid grid-cols-3 gap-6">
                    {dishes.map((dish, index) => (
                        <Dish key={index} {...dish} />
                    ))}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                    <h2 className="font-bold text-lg mb-4">Résumé de la commande</h2>
                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Prix total</span>
                        <span className="font-bold">$32.9</span>
                    </div>
                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Adresse</span>
                        <span>666 route de Satant</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Livraison</span>
                        <span>45 mins</span>
                    </div>
                    <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg w-full">
                        Suivi de livraison
                    </button>
                </div>
            </div>

        </>
    );
};

export default OrderConfirmation;