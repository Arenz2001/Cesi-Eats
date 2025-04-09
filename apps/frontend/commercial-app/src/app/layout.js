import './globals.css';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata = {
  title: 'CES\'EATS - Administration Commerciale',
  description: 'Plateforme d\'administration commerciale pour CES\'EATS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex flex-1 pt-14 md:pt-16">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
        <Footer className="md:ml-64" />
      </body>
    </html>
  );
}
