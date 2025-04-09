import React from 'react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-[#1e1e1e] text-sm text-black z-10">
            <div className="flex justify-between items-center px-6 py-4 bg-white shadow-inner">
                <p>© 2025 CES'EATS. Tous droits réservés.</p>
                <Link
                    href="/contact"
                    className="text-orange-600 hover:underline font-medium"
                >
                    Contactez-nous
                </Link>
            </div>
        </footer>
    )
}
