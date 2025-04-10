'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
    const router = useRouter();
    const { login, error: authError } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoading(true);
        
        try {
            const result = await login(email, password, rememberMe);
            
            if (result.success) {
                // Redirection vers la page d'accueil après connexion
                router.push('/');
            } else {
                setLoginError(result.error || 'Erreur de connexion');
            }
        } catch (error) {
            setLoginError('Erreur de connexion au serveur. Veuillez réessayer.');
            console.error('Erreur de connexion:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left section - Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24">
                <div className="max-w-md mx-auto">
                    {/* Logo and title */}
                    <div className="mb-8">
                        <h1 className="flex items-center font-bold text-black">
                            <span className="mr-2 text-3xl">🍴 CES'EATS</span> 
                            <i className="text-l pl-1">Interface développeur</i>
                        </h1>
                        <h2 className="text-xl font-semibold mt-4 text-black">
                            Connectez-vous pour accéder à l'interface développeur
                        </h2>
                    </div>

                    {/* Login error message */}
                    {(loginError || authError) && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {loginError || authError}
                        </div>
                    )}

                    {/* Login form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                            />
                        </div>

                        <div className="flex justify-between">
                            <div className="flex items-center mt-2">
                                <input 
                                    type="checkbox" 
                                    id="rememberMe" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="mr-2" 
                                />
                                <label htmlFor="rememberMe" className="text-sm text-black">
                                    Se souvenir de moi
                                </label>
                            </div>
                            <p className="text-sm text-gray-600 hover:text-gray-800 text-center mt-2">
                                <Link href="/forgot-password">Mot de passe oublié ?</Link>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 ${
                                isLoading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'
                            } text-white font-medium rounded-md transition-colors flex justify-center items-center`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion en cours...
                                </>
                            ) : 'S\'identifier'}
                        </button>
                    </form>

                    {/* Register link */}
                    <p className="text-gray-600 hover:text-gray-800 text-center mt-6">
                        Pas encore membre ? <Link href="/register" className="text-orange-500 hover:underline">Rejoignez-nous!</Link>
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
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
    );
}