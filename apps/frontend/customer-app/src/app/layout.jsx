"use client"
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {

  const pathname = usePathname();
  const hideNavbarRoutes = ['/login', '/register', '/forgot-password'];


  if (!pathname) return null;
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {!hideNavbarRoutes.includes(pathname) && <Navbar />}
            {children}
            {!hideNavbarRoutes.includes(pathname) && <Footer />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html >
  );
}
