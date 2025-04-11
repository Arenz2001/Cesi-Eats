"use client"
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext"
import AuthGuard from "@/components/AuthGuard";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const publicRoutes = ['/login', '/register', '/forgot-password'];

  if (!pathname) return null;
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <AuthGuard>
              {!publicRoutes.includes(pathname) && <Navbar />}
              {children}
              {!publicRoutes.includes(pathname) && <Footer />}
            </AuthGuard>
          </CartProvider>
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
