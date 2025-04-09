'use client';

export default function ComponentLibrary() {
  return (
    <section className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-[#030303] mb-4">Bibliothèque de Composants</h2>
      <div className="space-y-4">
        <p className="text-[#030303]/70">
          Explorez et intégrez nos composants réutilisables pour enrichir vos applications.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#EEEEEE] rounded-md p-4">
            <h3 className="text-lg font-medium text-[#030303] mb-2">Composant de Paiement</h3>
            <p className="text-[#030303]/70 mb-4">Intégrez un système de paiement sécurisé à votre application.</p>
            <button className="bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium">
              Documentation
            </button>
          </div>
          <div className="bg-[#EEEEEE] rounded-md p-4">
            <h3 className="text-lg font-medium text-[#030303] mb-2">Suivi de Commande</h3>
            <p className="text-[#030303]/70 mb-4">Ajoutez le suivi en temps réel des commandes.</p>
            <button className="bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium">
              Documentation
            </button>
          </div>
          <div className="bg-[#EEEEEE] rounded-md p-4">
            <h3 className="text-lg font-medium text-[#030303] mb-2">Carte Interactive</h3>
            <p className="text-[#030303]/70 mb-4">Intégrez une carte pour le suivi des livraisons.</p>
            <button className="bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium">
              Documentation
            </button>
          </div>
          <div className="bg-[#EEEEEE] rounded-md p-4">
            <h3 className="text-lg font-medium text-[#030303] mb-2">Authentification</h3>
            <p className="text-[#030303]/70 mb-4">Système d'authentification sécurisé.</p>
            <button className="bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 