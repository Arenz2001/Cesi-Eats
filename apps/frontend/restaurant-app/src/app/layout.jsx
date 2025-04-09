import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Navbar />
          <main className="pt-20 flex-1 ml-0 md:ml-64 transition-all">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
