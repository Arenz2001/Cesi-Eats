"use client"
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function Parametres() {
  const { user, updateEmail, updatePassword, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [passwordForEmail, setPasswordForEmail] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      const success = await updatePassword(currentPassword, newPassword);
      if (success) {
        toast.success("Mot de passe mis à jour avec succès");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du mot de passe");
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    try {
      const success = await updateEmail(newEmail, passwordForEmail);
      if (success) {
        toast.success("Email mis à jour avec succès");
        setNewEmail("");
        setPasswordForEmail("");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'email");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
        {user && (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Nom</p>
              <p className="font-medium">{user.name || "Non défini"}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Rôle</p>
              <p className="font-medium">Livreur</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Changer d'e-mail</h2>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouvel e-mail
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Votre mot de passe actuel
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                value={passwordForEmail}
                onChange={(e) => setPasswordForEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition"
            >
              Mettre à jour l'e-mail
            </button>
          </form>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Changer de mot de passe</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition"
            >
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
