import Dish from "@/components/Dishes";
import { Search } from "lucide-react";

const dishes = [
    { id: "1", name: "Spaghetti Carbonara", desc: "Recette originale", price: "12.99", likes: 24, imageUrl: "/lasagnes.jpg", quantity: 0 },
    { id: "2", name: "Chicken Tikka Masala", desc: "Un classique indien épicé", price: "10.49", likes: 13, imageUrl: "/lasagnes.jpg", quantity: 0 },
    { id: "3", name: "Lasagnes", desc: "Un repas italien typique", price: "12.99", likes: 24, imageUrl: "/lasagnes.jpg", quantity: 0 },
    { id: "4", name: "Gnocchi chèvre épinards", desc: "Une valeur sûre!", price: "10.49", likes: 13, imageUrl: "/lasagnes.jpg", quantity: 0 },
    { id: "5", name: "Tartine d’avocats", desc: "Un repas bien équilibré", price: "7.99", likes: 24, imageUrl: "/lasagnes.jpg", quantity: 0 },
    { id: "6", name: "Sauté de bœuf", desc: "Rapide à manger et savoureux!", price: "14.99", likes: 19, imageUrl: "/lasagnes.jpg", quantity: 0 },
    { id: "7", name: "Risotto aux champignons", desc: "Crémeux et délicieux!", price: "9.99", likes: 24, imageUrl: "/lasagnes.jpg", quantity: 0 },
    { id: "8", name: "Tiramisu", desc: "Un classique italien!", price: "6.99", likes: 30, imageUrl: "/lasagnes.jpg", quantity: 0 },
];



const DishListing = () => {

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Barre de recherche */}
            <div className="flex justify-center mb-6">
                <div className="relative w-1/2">
                    <input
                        type="text"
                        placeholder="Rechercher des plats"
                        className="w-full p-3 rounded-lg border shadow-sm pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>

            {/* Liste des plats */}
            <div className="grid grid-cols-4 gap-6">
                {dishes.map((dish, index) => (
                    <Dish key={index} dish={dish} />
                ))}
            </div>
        </div>
    );
};

export default DishListing;
