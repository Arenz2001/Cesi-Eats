import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-[#030303]">
                Portail Développeur
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="border-transparent text-[#030303]/70 hover:border-[#EF8732] hover:text-[#030303] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Accueil
              </Link>
              <Link href="/profile" className="border-transparent text-[#030303]/70 hover:border-[#EF8732] hover:text-[#030303] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Profil
              </Link>
              <Link href="/documentation" className="border-transparent text-[#030303]/70 hover:border-[#EF8732] hover:text-[#030303] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Documentation
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-[#EF8732] hover:bg-[#EF8732]/90 text-white px-4 py-2 rounded-md text-sm font-medium">
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
} 