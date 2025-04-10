"use client"
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Home() {
    const { login, error } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="flex min-h-screen">
            {/* Left section - Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                <div className="max-w-md mx-auto">
                    {/* Logo and title */}
                    <div className="mb-8">
                        <h1 className="flex items-center text-3xl font-bold text-black">
                            <span className="mr-2">🍴</span> CES'EATS
                        </h1>
                        <h2 className="text-xl font-semibold mt-4 text-black">Connectez-vous pour commander</h2>
                        <p className="text-sm mt-2  text-black">
                            Explorez les restaurants et passez vos commandes facilement
                        </p>
                    </div>

                    {/* Registration form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-red-500">{error}</p>}

                        <div className="flex justify-between">

                            <div className="flex items-center mt-2">
                                <input type="checkbox" id="rememberMe" className="mr-2" />
                                <label htmlFor="rememberMe" className="text-sm text-black">Se souvenir de moi</label>
                            </div>
                            <p className="text-sm text-gray-600 hover:text-gray-800 text-center mt-2">
                                <Link href="/forgot-password">Mot de passe oublié ?</Link>
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors"
                        >
                            S'identifier
                        </button>
                    </form>

                    {/* Login link */}
                    <p href="#" className="text-gray-600 hover:text-gray-800 text-center mt-6">
                        Pas encore membre ? <Link href="/register">Rejoignez-nous!</Link>
                    </p>
                </div>
            </div>

            {/* Right section - Food image */}
            <div className="hidden md:block w-1/2 relative">
                <div className="relative w-full h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
                        alt="Plat de nourriture"
                        fill
                        priority
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
    );
}
