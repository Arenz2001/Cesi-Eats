'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideNavbarRoutes = ['/login', '/register', '/forgot-password'];

  return (
    <AuthGuard>
      {!hideNavbarRoutes.includes(pathname) && <Navbar />}
      {children}
    </AuthGuard>
  );
} 