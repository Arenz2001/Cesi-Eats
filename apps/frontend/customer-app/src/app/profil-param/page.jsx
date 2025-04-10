"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
    const { user, updateEmail, updatePassword, deleteAccount, isAuthenticated, error } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [feedback, setFeedback] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    // Rediriger si non authentifié
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        } else if (user) {
            setFormData(prev => ({ ...prev, email: user.email }));
        }
    }, [isAuthenticated, router, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: "", message: "" });

        try {
            const success = await updateEmail(formData.email, formData.currentPassword);
            
            if (success) {
                setFeedback({ 
                    type: "success", 
                    message: "Adresse email mise à jour avec succès" 
                });
                setFormData(prev => ({ ...prev, currentPassword: "" }));
            } else {
                setFeedback({ 
                    type: "error", 
                    message: error || "Une erreur est survenue lors de la mise à jour de l'email" 
                });
            }
        } catch (err) {
            setFeedback({ 
                type: "error", 
                message: err.message || "Une erreur est survenue" 
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: "", message: "" });

        if (formData.newPassword !== formData.confirmPassword) {
            setFeedback({ 
                type: "error", 
                message: "Les mots de passe ne correspondent pas" 
            });
            setLoading(false);
            return;
        }

        try {
            const success = await updatePassword(formData.currentPassword, formData.newPassword);
            
            if (success) {
                setFeedback({ 
                    type: "success", 
                    message: "Mot de passe mis à jour avec succès" 
                });
                setFormData(prev => ({ 
                    ...prev, 
                    currentPassword: "", 
                    newPassword: "", 
                    confirmPassword: "" 
                }));
            } else {
                setFeedback({ 
                    type: "error", 
                    message: error || "Une erreur est survenue lors de la mise à jour du mot de passe" 
                });
            }
        } catch (err) {
            setFeedback({ 
                type: "error", 
                message: err.message || "Une erreur est survenue" 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
        
        if (confirmDelete) {
            setLoading(true);
            try {
                await deleteAccount();
                // La redirection est gérée dans la méthode deleteAccount
            } catch (err) {
                setFeedback({ 
                    type: "error", 
                    message: err.message || "Une erreur est survenue lors de la suppression du compte" 
                });
                setLoading(false);
            }
        }
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-2 text-gray-700">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-full max-w-xs bg-white p-6 border-r">
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-bold">{user.email}</h2>
                    <a href={`mailto:${user.email}`} className="text-sm text-gray-600 hover:underline">
                        {user.email}
                    </a>
                </div>

                <nav className="mt-10 space-y-4 text-sm">
                    <p><Link href="/profil" className="text-black">Historique de Commandes</Link></p>
                    <p><Link href="/profil-param" className="font-semibold text-gray-600 hover:text-black cursor-pointer">Paramètres</Link></p>
                    <p><button 
                        onClick={() => useAuth().logout()}
                        className="text-red-600 hover:text-red-800 cursor-pointer">
                        Déconnexion
                    </button></p>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10">
                <h1 className="text-2xl font-bold mb-6">Gestion des Paramètres</h1>

                {feedback.message && (
                    <div className={`p-4 mb-6 rounded ${feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {feedback.message}
                    </div>
                )}

                <div className="max-w-xl space-y-8">
                    {/* Mise à jour de l'email */}
                    <form onSubmit={handleEmailUpdate} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Modifier l'adresse email</h2>
                        <div>
                            <label className="block font-medium mb-1">Nouvelle adresse email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Mot de passe actuel (pour confirmer)</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 disabled:bg-orange-300"
                        >
                            {loading ? "Mise à jour..." : "Mettre à jour l'email"}
                        </button>
                    </form>

                    {/* Mise à jour du mot de passe */}
                    <form onSubmit={handlePasswordUpdate} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Modifier le mot de passe</h2>
                        <div>
                            <label className="block font-medium mb-1">Mot de passe actuel</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Nouveau mot de passe</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50"
                                minLength="6"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Confirmer le nouveau mot de passe</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50"
                                minLength="6"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 disabled:bg-orange-300"
                        >
                            {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                        </button>
                    </form>

                    {/* Suppression du compte */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-red-600">Supprimer mon compte</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Attention : Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 disabled:bg-red-300"
                        >
                            {loading ? "Suppression..." : "Supprimer mon compte"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
