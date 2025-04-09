"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Composant pour l'icône du menu hamburger
const MenuIcon = ({ onClick }) => (
  <button 
    onClick={onClick} 
    className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
  >
    <span className="block w-6 h-0.5 bg-black"></span>
    <span className="block w-6 h-0.5 bg-black"></span>
    <span className="block w-6 h-0.5 bg-black"></span>
  </button>
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Fermer le menu lors du changement de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-card-bg shadow-sm fixed top-0 left-0 right-0 z-20 border-b border-border-color">
      <div className="flex justify-between items-center py-2 md:py-3 pl-2 pr-2">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo-svg.svg" alt="CES'EATS Logo" width={40} height={32} className="md:w-[50px] md:h-[40px]" />
            <h1 className="text-lg md:text-xl font-bold text-black">CES'EATS</h1>
          </Link>
          <span className="ml-4 text-text-secondary hidden md:inline font-medium">Administration Commerciale</span>
        </div>
        
        <MenuIcon onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      </div>
      
      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card-bg border-b border-border-color py-2">
          <nav className="px-4 space-y-3">
            <Link 
              href="/tableau-de-bord" 
              className="block py-2 text-text-primary hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tableau de bord
            </Link>
            <Link 
              href="/gestion-comptes" 
              className="block py-2 text-text-primary hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Gestion des comptes
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 