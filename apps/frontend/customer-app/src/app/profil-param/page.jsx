"use client"
import React, { useState } from "react";
import Link from "next/link";
export default function SettingsPage() {
    const [email, setEmail] = useState("alexandre.dupont@example.com");
    const [password, setPassword] = useState("password");

    const handleSave = () => {
        // sauvegarde
        alert("Modifications enregistrées ✅");
    };

    const handleDeleteAccount = () => {
        // suppression compte
        const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer votre compte ?");
        if (confirmDelete) alert("Compte supprimé ❌");
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-full max-w-xs bg-white p-6 border-r">
                <div className="flex flex-col items-center">

                    <h2 className="text-lg font-bold">Alexandre Dupont</h2>
                    <a href="mailto:alexandre.dupont@example.com" className="text-sm text-gray-600 hover:underline">
                        alexandre.dupont@example.com
                    </a>
                </div>

                <nav className="mt-10 space-y-4 text-sm">
                    <p><Link href="/profil" className="text-black ">Historique de Commandes</Link></p>
                    <p>  <Link href="/profil-param" className="font-semibold text-gray-600 hover:text-black cursor-pointer">Paramètres</Link></p>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10">
                <h1 className="text-2xl font-bold mb-6">Gestion des Paramètres</h1>
                <div className="max-w-xl space-y-6">
                    <div>
                        <label className="block font-medium mb-1">Adresse Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Mot de Passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-gray-100"
                        />
                    </div>
                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-black text-white font-semibold rounded"
                    >
                        Enregistrer les Modifications
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded"
                    >
                        Supprimer mon compte
                    </button>
                </div>
            </main>
        </div>
    );
}
