import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Toaster position="top-center" />
        <AuthProvider>
          <Header />
          <div className="flex flex-1">
            <Navbar />
            <main className="pt-20 flex-1 ml-0 md:ml-64 transition-all">
              {children}
            </main>
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
