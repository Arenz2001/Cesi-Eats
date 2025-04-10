"use client"
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simuler une demande de réinitialisation
            // Dans un cas réel, il faudrait appeler l'API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setIsSubmitted(true);
            toast.success("Instructions envoyées ! Vérifiez votre boîte mail.");
        } catch (error) {
            toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-black mb-2">Mot de passe oublié</h1>
                    {!isSubmitted ? (
                        <p className="text-gray-600">
                            Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>
                    ) : (
                        <p className="text-green-600">
                            Si un compte est associé à {email}, vous recevrez un e-mail avec les instructions pour réinitialiser votre mot de passe.
                        </p>
                    )}
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse e-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors disabled:opacity-70"
                        >
                            {isSubmitting ? "Envoi en cours..." : "Envoyer les instructions"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-orange-500 hover:text-orange-600 mt-4"
                        >
                            Renvoyer à une autre adresse
                        </button>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-orange-500 hover:text-orange-600">
                        Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
} 