"use client"
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function Page() {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    // useEffect(() => {
    //     if (!isAuthenticated()) {
    //         router.push('/login');
    //     }
    // }, [isAuthenticated, router]);

    const orders = [
        {
            date: "12 Octobre 2023",
            restaurant: "Chez Pierre - Paris",
            total: "45,00 €",
        },
        {
            date: "5 Septembre 2023",
            restaurant: "La Belle Époque - Lyon",
            total: "30,00 €",
        },
        {
            date: "20 Août 2023",
            restaurant: "Gastronomie du Sud - Marseille",
            total: "60,00 €",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-full max-w-xs bg-white p-6 border-r">
                <div className="flex flex-col items-center">

                    <h2 className="text-lg font-bold">Alexandre Dupont</h2>
                    <p className="text-sm text-gray-600 hover:underline">
                        alexandre.dupont@example.com
                    </p>
                </div>

                <nav className="mt-10 space-y-4 text-sm">
                    <p><Link href="/profil" className="text-black font-semibold">Historique de Commandes</Link></p>
                    <p>  <Link href="/profil-param" className="text-gray-600 hover:text-black cursor-pointer">Paramètres</Link></p>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10">
                <h1 className="text-2xl font-bold mb-6">Historique de Commandes</h1>
                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <div key={index} className="flex justify-between items-center bg-orange-100 p-4 rounded-lg">
                            <div>
                                <p className="font-semibold">Le {order.date}</p>
                                <p className="text-sm text-gray-700">{order.restaurant}</p>
                            </div>
                            <p className="font-semibold">Total: {order.total}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
