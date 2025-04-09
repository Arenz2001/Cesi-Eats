"use client";

import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-card-bg shadow-sm fixed top-0 left-0 right-0 z-10 border-b border-border-color">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-xl font-bold text-primary">CES'EATS</h1>
          </Link>
          <span className="ml-4 text-text-secondary hidden md:inline font-medium">Administration Commerciale</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 