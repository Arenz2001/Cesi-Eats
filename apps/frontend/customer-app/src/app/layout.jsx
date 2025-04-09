"use client"
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext"
import AuthGuard from "@/components/AuthGuard";

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
      </body>
    </html>
  );
}
