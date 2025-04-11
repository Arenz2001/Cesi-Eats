"use client"
import Image from 'next/image';
import React from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function Header() {
    const pathname = usePathname()
    const { logout } = useAuth();

    const resolveTitle = (path) => {
        if (path === '/articles') return 'Gérer les articles'
        if (path === '/menus') return 'Gérer les menus'
        if (path.startsWith('/menus/edit/')) return 'Modifier un menu'
        if (path === '/menus/create') return 'Ajouter un menu'
        if (path === '/commandes') return 'Gérer les commandes'
        if (path === '/statistiques') return 'Voir les statistiques'
        if (path === '/parametres') return 'Paramètres'
        return 'Accueil'
    }

    const pageTitle = resolveTitle(pathname)
    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-6 bg-white shadow-sm">
                {/* Logo */}
                <div className="flex items-center">
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
                
                <h1 className="text-2xl font-bold">{pageTitle}</h1>
                
                {/* Bouton de déconnexion */}
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Déconnexion</span>
                </button>
            </header>
        </>
    );
}