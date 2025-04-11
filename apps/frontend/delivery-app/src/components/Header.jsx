"use client"
import Image from 'next/image';
import React from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const pathname = usePathname()
    const { logout, user } = useAuth();

    const titles = {
        '/commandes-disponibles': 'Commandes disponibles',
        '/commandes-cours': 'Commande en cours',
        '/historique': 'Historiques des commandes',
        '/parametres': 'Paramètres',
        '/parametres/edit': 'Paramètres',

    }

    const handleLogout = () => {
        logout();
    };

    const pageTitle = titles[pathname] || 'Accueil'
    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 px-6 bg-white shadow-sm">
                {/* Logo */}
                <div className="flex items-center ">
                    <Link href="/">
                        <Image width={40}
                            height={40}
                            src="/logo.svg"
                            alt="CES'EATS"
                            className="h-8 mr-2" />
                    </Link>
                    <Link href="/">
                        <span className="text-xl font-bold">CES'EATS</span>
                    </Link>
                </div>
                <h1 className="mx-auto text-2xl font-bold">{pageTitle}</h1>
                
                {/* Bouton de déconnexion */}
                {user && (
                    <div className="flex items-center">
                        <span className="mr-3 text-sm hidden md:inline-block text-gray-600">
                            {user.email}
                        </span>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            <LogOut size={18} />
                            <span className="hidden md:inline">Déconnexion</span>
                        </button>
                    </div>
                )}
            </header>

        </>
    );
}