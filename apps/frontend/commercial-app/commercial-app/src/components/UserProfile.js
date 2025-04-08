import Image from 'next/image';
import { Mail, Phone, MapPin, Calendar, Shield, Clock } from 'lucide-react';

const UserProfile = ({ user, onModify, onSuspend }) => {
  if (!user) return (
    <div className="bg-card-bg h-full rounded-md shadow-lg border border-secondary flex items-center justify-center text-text-secondary">
      <p className="text-lg">Sélectionnez un utilisateur pour voir ses détails</p>
    </div>
  );

  // Helper function to safely get initials
  const getInitials = () => {
    const firstname = user.firstname || user.name || '?';
    const lastname = user.lastname || '';
    return `${firstname[0] || ''}${lastname[0] || ''}`;
  };
  
  // Helper function to safely get full name
  const getFullName = () => {
    const firstname = user.firstname || user.name || '';
    const lastname = user.lastname || '';
    return `${firstname} ${lastname}`.trim() || 'Utilisateur';
  };

  return (
    <div className="bg-card-bg h-full rounded-md shadow-lg border border-secondary overflow-hidden">
      <div className="p-6 bg-secondary border-b border-border-color flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-medium mb-4 overflow-hidden">
          {user.profilePicture ? (
            <Image src={user.profilePicture} alt={getFullName()} width={96} height={96} className="object-cover" />
          ) : (
            <span>{getInitials()}</span>
          )}
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-1">{getFullName()}</h2>
        <p className="text-text-secondary">{user.type || 'Utilisateur'}</p>
        
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onModify(user)}
            className="px-4 py-2 bg-button-modify text-white rounded-md hover:bg-indigo-600 transition duration-200 shadow-sm"
          >
            Modifier
          </button>
          <button
            onClick={() => onSuspend(user)}
            className={`px-4 py-2 text-white rounded-md transition duration-200 shadow-sm ${
              user.suspended
                ? "bg-green-600 hover:bg-green-700"
                : "bg-button-suspend hover:bg-orange-600"
            }`}
          >
            {user.suspended ? "Réactiver" : "Suspendre"}
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary border-b border-border-color pb-2">Informations personnelles</h3>
            
            <div className="flex items-center text-text-secondary">
              <Mail className="h-5 w-5 mr-3 text-primary" />
              <span>{user.email || 'Aucun email'}</span>
            </div>
            
            {user.phone && (
              <div className="flex items-center text-text-secondary">
                <Phone className="h-5 w-5 mr-3 text-primary" />
                <span>{user.phone}</span>
              </div>
            )}
            
            {user.address && (
              <div className="flex items-center text-text-secondary">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <span>{user.address}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary border-b border-border-color pb-2">Détails du compte</h3>
            
            {user.createdAt && (
              <div className="flex items-center text-text-secondary">
                <Calendar className="h-5 w-5 mr-3 text-primary" />
                <span>Créé le: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="flex items-center text-text-secondary">
              <Shield className="h-5 w-5 mr-3 text-primary" />
              <span>Statut: {user.suspended ? 
                <span className="text-red-600 font-medium">Suspendu</span> : 
                <span className="text-green-600 font-medium">Actif</span>}
              </span>
            </div>
            
            {user.lastLogin && (
              <div className="flex items-center text-text-secondary">
                <Clock className="h-5 w-5 mr-3 text-primary" />
                <span>Dernière connexion: {new Date(user.lastLogin).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 