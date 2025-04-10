'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
export default function Navbar() {
    const { logout, error } = useAuth();

    const [open, setOpen] = useState(false)
    const isLoggedIn = true // 🔐 Simule l'état de connexion (tu peux le connecter plus tard à ton auth)
    const handleSubmitLogout = async (e) => {
        await logout();
    };
    return (
        <nav className="flex items-center justify-between bg-gray-100 shadow-md p-4 border-b border-gray-300 relative z-50">
            {/* Logo + Liens */}
            <div className="flex items-center">
                <Link href="/accueil">
                    <Image width={40} height={40} src="/logo.svg" alt="CES'EATS" className="h-8 mr-2" />
                </Link>
                <Link href="/accueil">
                    <span className="text-xl font-bold">CES'EATS</span>
                </Link>
                <div className="flex space-x-4 ml-24">
                    <Link href="/accueil" className="text-gray-700 hover:text-orange-500">
                        ACCUEIL
                    </Link>
                    <Link href="/restaurants" className="text-gray-700 hover:text-orange-500">
                        RESTAURANTS
                    </Link>
                    <Link href="/search-dishes" className="text-gray-700 hover:text-orange-500">
                        PLATS
                    </Link>
                </div>
            </div>

            {/* Icônes */}
            <div className="flex items-center space-x-6 mr-6 relative">
                <Link href="/panier">
                    <FaShoppingCart className="text-gray-700 hover:text-orange-500 h-6 w-6" />
                </Link>

                {/* Profil avec dropdown */}
                <div className="relative">
                    <button onClick={() => setOpen(!open)} className="focus:outline-none">
                        <FaUserCircle className="text-gray-700 hover:text-orange-500 h-6 w-6" />
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-50">
                            <Link
                                href="/profil"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setOpen(false)}
                            >
                                Mon profil
                            </Link>
                            {isLoggedIn ? (
                                <button
                                    onClick={() => {
                                        // future logout logic
                                        handleSubmitLogout()
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                >
                                    Déconnexion
                                </button>
                            ) : (
                                <Link
                                    href="/connexion"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setOpen(false)}
                                >
                                    Connexion
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
