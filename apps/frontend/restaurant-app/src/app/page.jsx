import Image from "next/image";
import Link from "next/link";
import React from 'react';

export default function Home() {


  return (
    <div className="flex h-[80vh] bg-[#fff7ea]">



      {/* Main Content */}
      <div className="flex-1 px-12 py-8 min-h-screen ">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card title="articles" desc="Ajoutez, modifiez et supprimez des articles du catalogue." />
          <Card title="menus" desc="Ajoutez, modifiez et supprimez des menus du catalogue." />
          <Card title="commandes" desc="Accepter, suivre les commandes en cours" />
          <Card title="statistiques" desc="Une vue d'ensemble des statistiques du restaurant" />
          <Card title="paramètres" desc="Gérer les paramètres du profil connecté" />
        </div>
      </div>
    </div>
  );
}
const Card = ({ title, desc }) => (
  <Link href={`/${title}`}>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700">{desc}</p>
    </div>
  </Link>
);

