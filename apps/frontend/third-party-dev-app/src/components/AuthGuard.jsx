'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AuthGuard({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, loading } = useAuth()

    const publicRoutes = ['/login', '/register', '/forgot-password']

    useEffect(() => {
        if (!loading && !user && !publicRoutes.includes(pathname)) {
            router.push('/login')
        }
    }, [user, loading, pathname, router])

    if (loading) return <LoadingSpinner />

    // Si route publique OU user connecté, on laisse passer
    if (publicRoutes.includes(pathname) || user) {
        return children
    }

    // Sinon, on n'affiche rien le temps de redirection
    return null
} 