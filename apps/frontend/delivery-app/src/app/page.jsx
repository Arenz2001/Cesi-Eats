import Image from "next/image";
import Link from "next/link";
import React from 'react';

export default function Home() {


  return (
    <div className="flex h-[80vh] bg-[#fff7ea]">



      {/* Main Content */}
      <div className="flex-1 px-12 py-8 min-h-screen ">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card title="Commandes disponibles" desc="Voir les commandes disponible à livrer" href="commandes-disponibles" />
          <Card title="Commandes en cours" desc="Voir la commande acceptée en cours" href="commandes-cours" />
          <Card title="Historique en commandes" desc="Voir la liste des commandes déjà livrées" href="historique" />
          <Card title="Parametres" desc="Gérer les paramètres du profil connecté" href="parametres" />
        </div>
      </div>
    </div>
  );
}
const Card = ({ title, desc, href }) => (
  <Link href={`/${href}`}>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700">{desc}</p>
    </div>
  </Link>
);

