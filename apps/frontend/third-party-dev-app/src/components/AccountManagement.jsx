'use client';

export default function AccountManagement() {
  const handleDeleteAccount = () => {
    // TODO: Implémenter la logique de suppression du compte
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
    }
  };

  return (
    <section className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-[#030303] mb-4">Gestion du Compte</h2>
      <div className="space-y-4">
        <p className="text-[#030303]/70">
          Gérez vos informations personnelles et les paramètres de votre compte développeur.
        </p>
        <div className="flex space-x-4">
          <button className="bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium">
            Modifier le Profil
          </button>
          <button className="bg-[#EEEEEE] hover:bg-[#EEEEEE]/90 text-[#030303] px-4 py-2 rounded-md text-sm font-medium">
            Paramètres du Compte
          </button>
        </div>
      </div>
    </section>
  );
} 