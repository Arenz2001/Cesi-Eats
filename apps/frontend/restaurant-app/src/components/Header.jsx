"use client"
import Image from 'next/image';
import React from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname()

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

            </header>

        </>
    );
}