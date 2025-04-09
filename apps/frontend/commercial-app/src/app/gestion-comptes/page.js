"use client";

import { useState, useEffect } from 'react';
// import PageTitle from '@/components/PageTitle';
import UsersTable from '@/components/UsersTable';
import UserModal from '@/components/UserModal';

export default function GestionComptes() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockUsers = [
      { id: 1, name: 'Jean Dupont', email: 'jean.dupont@example.com', status: 'active' },
      { id: 2, name: 'Marie Martin', email: 'marie.martin@example.com', status: 'active' },
      { id: 3, name: 'Pierre Durand', email: 'pierre.durand@example.com', status: 'suspended' },
      { id: 4, name: 'Sophie Lefebvre', email: 'sophie.lefebvre@example.com', status: 'active' },
      { id: 5, name: 'Lucas Bernard', email: 'lucas.bernard@example.com', status: 'active' },
      { id: 6, name: 'Emma Petit', email: 'emma.petit@example.com', status: 'active' },
      { id: 7, name: 'Thomas Robert', email: 'thomas.robert@example.com', status: 'suspended' },
      { id: 8, name: 'Chloé Moreau', email: 'chloe.moreau@example.com', status: 'active' },
      { id: 9, name: 'Hugo Simon', email: 'hugo.simon@example.com', status: 'active' },
      { id: 10, name: 'Léa Dubois', email: 'lea.dubois@example.com', status: 'active' },
      { id: 11, name: 'Noah Michel', email: 'noah.michel@example.com', status: 'active' },
      { id: 12, name: 'Jade Leroy', email: 'jade.leroy@example.com', status: 'suspended' },
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleModifyUser = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleSuspendUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' } 
        : user
    ));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleSaveUser = (userData) => {
    setUsers(users.map(user => 
      user.id === selectedUserId 
        ? { ...user, ...userData } 
        : user
    ));
    handleModalClose();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gestion des comptes</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <UsersTable 
          users={users} 
          onModifyUser={handleModifyUser} 
          onSuspendUser={handleSuspendUser} 
        />
      )}

      {isModalOpen && selectedUserId && (
        <UserModal 
          user={users.find(u => u.id === selectedUserId)}
          onClose={handleModalClose}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
} 