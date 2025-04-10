'use client';

import ClientLayout from './ClientLayout';

export default function Layout({ children }) {
  return (
    <ClientLayout>
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </ClientLayout>
  );
} 