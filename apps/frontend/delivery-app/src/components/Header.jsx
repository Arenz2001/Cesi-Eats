"use client"
import Image from 'next/image';
import React from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname()

    const titles = {
        '/commandes-disponibles': 'Commandes disponibles',
        '/commandes-cours': 'Commande en cours',
        '/historique': 'Historiques des commandes',
        '/parametres': 'Paramètres',
        '/parametres/edit': 'Paramètres',

    }

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

            </header>

        </>
    );
}