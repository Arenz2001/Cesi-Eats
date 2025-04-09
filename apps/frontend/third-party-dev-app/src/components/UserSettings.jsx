'use client';

import { useState } from 'react';
import { FaLock, FaTrash, FaUserCircle, FaSave, FaCheckCircle } from 'react-icons/fa';

export default function UserSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Simulation de changement de mot de passe réussi
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordChanged(true);
    
    // Réinitialiser l'état après 3 secondes
    setTimeout(() => {
      setPasswordChanged(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#EF8732] to-[#F7B76C] px-6 py-4">
        <div className="flex items-center">
          <FaUserCircle className="w-5 h-5 text-white" />
          <h2 className="ml-2 text-lg font-bold text-white">Gestion du compte</h2>
        </div>
      </div>
      
      <div className="p-6">
        {/* Formulaire de changement de mot de passe */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
            <FaLock className="w-4 h-4 mr-2 text-[#EF8732]" />
            Modifier mon mot de passe
          </h3>
          
          <form onSubmit={handlePasswordChange}>
            <div className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-xs font-medium text-gray-700 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#EF8732]"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-xs font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#EF8732]"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-xs font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#EF8732]"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex items-center justify-center py-2 bg-[#EF8732] hover:bg-[#EF8732]/90 text-white rounded-md text-sm font-medium transition-colors"
              >
                {passwordChanged ? (
                  <>
                    <FaCheckCircle className="w-4 h-4 mr-2" />
                    Mot de passe modifié avec succès
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4 mr-2" />
                    Modifier le mot de passe
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Section de suppression de compte */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
            <FaTrash className="w-4 h-4 mr-2 text-red-500" />
            Supprimer mon compte
          </h3>
          
          <p className="text-xs text-gray-500 mb-4">
            La suppression de votre compte est définitive et entraînera la perte de toutes vos données et applications.
          </p>
          
          {deleteConfirmOpen ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600 mb-3">
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded text-xs font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    // Logique de suppression de compte
                    alert("Fonctionnalité de suppression non implémentée");
                    setDeleteConfirmOpen(false);
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium"
                >
                  Confirmer la suppression
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="w-full py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-md text-sm font-medium transition-colors"
            >
              Supprimer mon compte
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 