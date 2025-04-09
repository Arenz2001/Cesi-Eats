"use client"
import Image from "next/image";
import { redirect } from 'next/navigation'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated());
    if (!isAuthenticated()) {
      console.log('Redirecting to /login');
      router.push('/login');
    } else {
      console.log('Redirecting to /accueil');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <></>
  );
}
