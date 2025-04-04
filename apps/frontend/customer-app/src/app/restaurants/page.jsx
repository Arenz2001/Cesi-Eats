"use client"
import React, { useState } from "react";
import { Search } from "lucide-react";

const restaurantsData = [
    {
        name: "La Piazza",
        cuisine: "Italian",
        description: "Restaurant Italien authentique!",
        rating: 4,
        image: "/pizza.png",
    },
    {
        name: "El Sol",
        cuisine: "Mexican",
        description: "Spicy and flavorful Mexican dishes.",
        rating: 4,
        image: "/pizza.png",
    },
    {
        name: "Sushi Zen",
        cuisine: "Japanese",
        description: "Fresh sushi and sashimi crafted to perfection.",
        rating: 4.5,
        image: "/pizza.png",
    },
];

export default function RestaurantFilter() {
    const [selectedCuisine, setSelectedCuisine] = useState("All");
    const [selectedRatings, setSelectedRatings] = useState([4, 3]);

    const handleRatingChange = (rating) => {
        setSelectedRatings((prev) =>
            prev.includes(rating)
                ? prev.filter((r) => r !== rating)
                : [...prev, rating]
        );
    };

    const filteredRestaurants = restaurantsData.filter(
        (restaurant) =>
            (selectedCuisine === "All" || restaurant.cuisine === selectedCuisine) &&
            selectedRatings.some((r) => Math.floor(restaurant.rating) === r)
    );

    return (
        <div className="flex gap-4 p-4 pt-24 pb-24">
            {/* Filters */}
            <div className="w-1/5 p-4 border rounded-xl">
                <h2 className="text-xl font-semibold mb-4">Filtres</h2>

                <div className="mb-4">
                    <label htmlFor="cuisine" className="block mb-2 font-medium">
                        Cuisine
                    </label>
                    <select
                        id="cuisine"
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="All">Tout</option>
                        <option value="Italian">Italian</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Japanese">Japanese</option>
                    </select>
                </div>

                <div>
                    <p className="font-medium mb-2">Rating</p>
                    {[4, 3].map((rating) => (
                        <label key={rating} className="flex items-center gap-2 mb-1">
                            <input
                                type="checkbox"
                                checked={selectedRatings.includes(rating)}
                                onChange={() => handleRatingChange(rating)}
                            />
                            {rating}★
                        </label>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="w-4/5">
                <div className="relative w-1/2 flex gap-2 mb-10 m-auto">
                    <input
                        type="text"
                        placeholder="Rechercher des restaurants"
                        className="w-full p-3 rounded-lg border shadow-sm pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {filteredRestaurants.map((restaurant) => (
                        <div key={restaurant.name} className="border rounded-xl overflow-hidden">
                            <img
                                src={restaurant.image}
                                alt={restaurant.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-1">{restaurant.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                                <p className="text-yellow-600 mb-2">
                                    {"★".repeat(Math.floor(restaurant.rating))}
                                    {restaurant.rating % 1 ? "½" : ""}
                                </p>
                                <button className="bg-orange-500 text-white py-1 px-4 rounded">
                                    Voir la carte
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
