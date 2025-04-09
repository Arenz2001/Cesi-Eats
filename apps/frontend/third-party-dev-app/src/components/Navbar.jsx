'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaUserCircle } from 'react-icons/fa'
import { Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        setOpen(false)
        setMobileMenuOpen(false)
    }

    return (
        <nav className="bg-white shadow relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo + Liens */}
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center">
                                <Image src="/logo.svg" alt="CES'EATS" width={40} height={32} className="mr-2" />
                                <span className="text-xl font-bold text-[#030303]">Portail Développeur</span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/" className="border-transparent text-[#030303]/70 hover:border-[#EF8732] hover:text-[#030303] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Accueil
                            </Link>
                            <Link href="/documentation" className="border-transparent text-[#030303]/70 hover:border-[#EF8732] hover:text-[#030303] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Documentation
                            </Link>
                        </div>
                    </div>
                    
                    {/* Bouton menu mobile */}
                    <div className="sm:hidden flex items-center">
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-700 hover:text-[#EF8732] focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Profil */}
                    <div className="hidden sm:flex items-center">
                        <div className="relative">
                            <button onClick={() => setOpen(!open)} className="focus:outline-none flex items-center">
                                <FaUserCircle className="text-gray-700 hover:text-[#EF8732] h-6 w-6 mr-2" />
                                <span className="text-sm font-medium text-gray-700">{user?.firstName || user?.email?.split('@')[0]}</span>
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                        <p className="text-xs font-semibold text-[#EF8732] mt-1">Développeur</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu mobile */}
            {mobileMenuOpen && (
                <div className="sm:hidden bg-white border-t border-gray-200 pt-2 pb-3">
                    <div className="space-y-1 px-4">
                        <div className="border-b border-gray-200 pb-2 mb-2">
                            <p className="text-sm font-medium text-gray-800">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                            <p className="text-xs font-semibold text-[#EF8732] mt-1">Développeur</p>
                        </div>
                        
                        <Link 
                            href="/" 
                            className="block px-3 py-2 text-base font-medium text-[#030303] hover:bg-gray-100 hover:text-[#EF8732]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Accueil
                        </Link>
                        <Link 
                            href="/documentation" 
                            className="block px-3 py-2 text-base font-medium text-[#030303] hover:bg-gray-100 hover:text-[#EF8732]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Documentation
                        </Link>
                        
                        {/* Bouton de déconnexion pour mobile */}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-gray-100"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}