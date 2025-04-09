import Link from 'next/link';

const Footer = ({ className = '' }) => {
  return (
    <footer className={`py-4 border-t border-gray-200 mt-auto bg-side-bg ${className}`}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-text-secondary">
          © {new Date().getFullYear()} CES'EATS. Tous droits réservés.
        </p>
        
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <Link href="/contact" className="text-sm text-primary hover:underline">
            Contactez-nous
          </Link>
          
          <div className="flex space-x-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary">
              FB
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary">
              IG
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary">
              TW
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 