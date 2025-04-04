import { Search } from "lucide-react";
import Image from 'next/image';
import React from 'react';
import { FaShoppingCart, FaUserCircle, FaSearch } from 'react-icons/fa';
import Link from "next/link";
export default function Navbar() {
    return (
        <>
            <nav className="flex items-center justify-between bg-gray-100 shadow-md p-4 border-b border-gray-300">
                {/* Logo */}
                <div className="flex items-center ">
                    <Link href="/accueil">
                        <Image width={40}
                            height={40}
                            src="/logo.svg"
                            alt="CES'EATS"
                            className="h-8 mr-2" />
                    </Link>
                    <Link href="/accueil">
                        <span className="text-xl font-bold">CES'EATS</span>
                    </Link>
                    <div className="flex space-x-4 ml-24">
                        <a href="/accueil" className="text-gray-700 hover:text-orange-500">ACCUEIL</a>
                        <a href="/restaurants" className="text-gray-700 hover:text-orange-500">RESTAURANTS</a>
                        <a href="/search-dishes" className="text-gray-700 hover:text-orange-500">PLATS</a>

                    </div>
                </div>



                {/* Search Bar */}
                <div className="relative w-1/2 flex gap-2  m-auto ">
                    <input
                        type="text"
                        placeholder="Rechercher des plats"
                        className="w-full p-3 rounded-lg  shadow-sm pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-4 mr-6">
                    <Link href="/panier">
                        <FaShoppingCart className="text-gray-700 hover:text-orange-500 h-6 w-6 mr-8" />
                    </Link>
                    <Link href="/profil">
                        <FaUserCircle className="text-gray-700 hover:text-orange-500 h-6 w-6" />
                    </Link>
                </div>

            </nav>

        </>
    );
}