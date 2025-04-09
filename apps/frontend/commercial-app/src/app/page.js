"use client";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Accueil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Tableau de bord</h2>
          <p className="text-gray-600 mb-4">
            Suivi de processus de commande en temps réel
          </p>
          <a href="/tableau-de-bord" className="btn btn-primary">
            Accéder
          </a>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Gestion des comptes</h2>
          <p className="text-gray-600 mb-4">
            Ajouter, suspendre, modifier et supprimer des comptes.
          </p>
          <a href="/gestion-comptes" className="btn btn-primary">
            Accéder
          </a>
        </div>
      </div>
    </div>
  );
}
