'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const links = [
        { href: '/articles', label: 'Gérer les articles' },
        { href: '/menus', label: 'Gérer les menus' },
        { href: '/commandes', label: 'Gérer les commandes' },
        { href: '/statistiques', label: 'Voir les statistiques' },
        { href: '/parametres', label: 'Paramètres' },
    ]

    return (
        <>
            {/* Mobile burger */}
            <div className="fixed top-5 right-4 z-50 md:hidden">
                <button onClick={() => setOpen(!open)} className="p-2 bg-white rounded shadow">
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-20  h-[calc(100vh-5rem)] w-64 bg-white shadow-sm px-6 py-8 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 `}
            >
                <p className="text-2xl  pb-6">Navigation</p>

                <nav className="space-y-4 font-medium text-black">
                    {links.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <p
                                key={link.href}
                                className={`cursor-pointer ${isActive ? 'text-gray-400' : 'hover:text-yellow-600'}`}
                            >
                                <Link href={link.href} onClick={() => setOpen(false)}>
                                    {link.label}
                                </Link>
                            </p>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}
