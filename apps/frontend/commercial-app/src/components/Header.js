"use client";

import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-card-bg shadow-sm fixed top-0 left-0 right-0 z-10 border-b border-border-color">
      <div className="flex justify-between items-center py-3 pl-2">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo-svg.svg" alt="CES'EATS Logo" width={50} height={40} />
            <h1 className="text-xl font-bold text-black">CES'EATS</h1>
          </Link>
          <span className="ml-4 text-text-secondary hidden md:inline font-medium">Administration Commerciale</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 