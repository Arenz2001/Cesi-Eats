import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Cesi Eats - Portail Développeur',
  description: 'Portail développeur pour les intégrations tierces de Cesi Eats',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#EEEEEE] min-h-screen`}>
        <Header />
        {children}
      </body>
    </html>
  );
} 