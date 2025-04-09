'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AuthGuard({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, loading } = useAuth()

    const publicRoutes = ['/login', '/register', '/forgot-password']

    useEffect(() => {
        if (!loading && !user && !publicRoutes.includes(pathname)) {
            router.push('/login')
        }
    }, [user, loading, pathname])

    if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>

    // Si route publique OU user connecté, on laisse passer
    if (publicRoutes.includes(pathname) || user) {
        return children
    }

    // Sinon, on n'affiche rien le temps de redirection
    return null
}
