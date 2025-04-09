'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const hideNavbarRoutes = ['/login', '/register', '/forgot-password'];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {!hideNavbarRoutes.includes(pathname) && <Navbar />}
      {children}
    </>
  );
} 