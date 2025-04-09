"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';

const UsersList = ({ users = [], onModify, onSuspend, onUserClick, selectedUser, searchTerm = '', setSearchTerm }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  // Safely access user properties and handle undefined values
  const safeFilter = (user) => {
    const firstname = user.firstname || user.name || '';
    const lastname = user.lastname || '';
    const email = user.email || '';
    
    return (
      firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(safeFilter);
  
  // Calculer les index des utilisateurs à afficher
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Générer les numéros de page à afficher
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Helper function to safely get initials
  const getInitials = (user) => {
    const firstname = user.firstname || user.name || '?';
    const lastname = user.lastname || '';
    return `${firstname[0] || ''}${lastname[0] || ''}`;
  };
  
  // Helper function to safely get full name
  const getFullName = (user) => {
    const firstname = user.firstname || user.name || '';
    const lastname = user.lastname || '';
    return `${firstname} ${lastname}`.trim() || 'Utilisateur';
  };
  
  return (
    <div className="bg-card-bg h-full rounded-md shadow-lg border border-secondary overflow-hidden">
      <div className="p-4 bg-secondary border-b border-border-color">
        <h2 className="text-lg font-medium text-text-primary">Utilisateurs</h2>
      </div>
      
      <div className="p-4 border-b border-border-color">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-10 pr-4 py-2 rounded-md bg-white border border-input-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-132px)]">
        {filteredUsers.map((user) => (
          <div
            key={user._id || user.id}
            className={`p-4 flex items-center cursor-pointer hover:bg-side-bg border-b border-border-color ${
              selectedUser && (selectedUser._id === user._id || selectedUser.id === user.id) ? 'bg-side-bg' : ''
            }`}
            onClick={() => onUserClick(user)}
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-text-primary font-medium overflow-hidden">
              {user.profilePicture ? (
                <Image src={user.profilePicture} alt={getFullName(user)} width={40} height={40} className="object-cover" />
              ) : (
                <span>{getInitials(user)}</span>
              )}
            </div>
            <div className="ml-3">
              <p className="font-medium text-text-primary">{getFullName(user)}</p>
              <p className="text-sm text-text-secondary">{user.email || 'Aucun email'}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="bg-secondary px-4 py-3 flex items-center justify-between border-t-2 border-border-color">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-text-secondary font-medium">
              Affichage de <span className="font-bold">{filteredUsers.length > 0 ? indexOfFirstUser + 1 : 0}</span>
              {' à '}
              <span className="font-bold">
                {indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}
              </span>
              {' sur '}
              <span className="font-bold">{filteredUsers.length}</span> utilisateurs
            </p>
          </div>
          <div>
            {totalPages > 1 && (
              <nav className="relative z-0 inline-flex rounded-md shadow-md -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border-2 border-border-color bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-text-secondary hover:bg-secondary'
                  }`}
                >
                  <span className="sr-only">Précédent</span>
                  &laquo;
                </button>
                
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`relative inline-flex items-center px-4 py-2 border-2 border-border-color bg-white text-sm font-medium ${
                      currentPage === number
                        ? 'z-10 bg-primary text-white border-primary'
                        : 'text-text-secondary hover:bg-secondary'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border-2 border-border-color bg-white text-sm font-medium ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-text-secondary hover:bg-secondary'
                  }`}
                >
                  <span className="sr-only">Suivant</span>
                  &raquo;
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList; 