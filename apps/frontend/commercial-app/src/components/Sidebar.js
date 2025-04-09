"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-side-bg border-r border-border-color pt-20 pb-4 px-4 flex flex-col overflow-y-auto z-0">
      <h2 className="text-lg font-bold mb-6 text-text-primary border-b border-border-color pb-2">Navigation</h2>
      <nav className="flex-1 space-y-2">
        <Link 
          href="/tableau-de-bord" 
          className={`sidebar-link ${isActive('/tableau-de-bord') ? 'active' : 'text-text-secondary'}`}
        >
          Tableau de bord
        </Link>
        <Link 
          href="/gestion-comptes" 
          className={`sidebar-link ${isActive('/gestion-comptes') ? 'active' : 'text-text-secondary'}`}
        >
          Gestion des comptes
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar; 