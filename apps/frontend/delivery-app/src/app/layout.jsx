"use client"
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <AuthGuard>
            {!isPublicRoute && <Header />}
            <div className="flex flex-1">
              {!isPublicRoute && <Navbar />}
              <main className={`${!isPublicRoute ? 'pt-20 ml-0 md:ml-64' : ''} flex-1 transition-all`}>
                {children}
              </main>
            </div>
            {!isPublicRoute && <Footer />}
          </AuthGuard>
        </AuthProvider>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
            },
            success: {
              style: {
                border: '1px solid #38a169',
                padding: '16px',
              },
            },
            error: {
              style: {
                border: '1px solid #e53e3e',
                padding: '16px',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
