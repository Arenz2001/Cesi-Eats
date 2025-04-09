'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AuthGuard({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, loading, accessToken } = useAuth()

    const publicRoutes = ['/login', '/register', '/forgot-password']
    const isPublicRoute = publicRoutes.includes(pathname)

    useEffect(() => {
        if (!loading) {
            // Si on est sur une route publique et qu'on est déjà connecté, on redirige vers l'accueil
            if (isPublicRoute && accessToken) {
                router.push('/accueil')
                return
            }

            // Si on est sur une route privée et qu'on n'est pas connecté, on redirige vers login
            if (!isPublicRoute && !accessToken) {
                router.push('/login')
                return
            }
        }
    }, [accessToken, loading, pathname, isPublicRoute])

    // Afficher un loader pendant la vérification
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    // Si on est sur une route publique OU si on est authentifié, on affiche le contenu
    if (isPublicRoute || accessToken) {
        return children
    }

    // Dans tous les autres cas, on n'affiche rien pendant la redirection
    return null
}
