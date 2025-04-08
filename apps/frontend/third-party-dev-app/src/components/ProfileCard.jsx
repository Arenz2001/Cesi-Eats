'use client';

import Image from 'next/image';

export default function ProfileCard({ user }) {
  const defaultUser = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: '/avatar.jpg',
    phone: '(123) 456-7890',
    personalEmail: 'xyz@gmail.com'
  };

  const userData = user || defaultUser;

  return (
    <div className="bg-background rounded-lg shadow p-6">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src={userData.avatar}
            alt={userData.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h2 className="text-xl font-semibold text-dark">{userData.name}</h2>
        <a href={`mailto:${userData.email}`} className="text-primary hover:text-primary/90">
          {userData.email}
        </a>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-dark mb-4">Contact Details</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-dark/60">Phone:</span>
            <span className="ml-2 text-dark">{userData.phone}</span>
          </div>
          <div className="flex items-center">
            <span className="text-dark/60">Mail:</span>
            <span className="ml-2 text-dark">{userData.personalEmail}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 