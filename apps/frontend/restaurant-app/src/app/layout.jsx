import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
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
