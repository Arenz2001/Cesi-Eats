import AccountManagement from '@/components/AccountManagement';
import ApiKeyManagement from '@/components/ApiKeyManagement';
import ComponentLibrary from '@/components/ComponentLibrary';
import UserSettings from '@/components/UserSettings';

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Portail Développeur</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Colonne principale avec API Keys et Component Library */}
        <div className="lg:col-span-2 space-y-6">
          <ApiKeyManagement />
          <ComponentLibrary />
        </div>
        
        {/* Colonne latérale avec gestion utilisateur */}
        <div className="lg:col-span-1 space-y-6">
          <UserSettings />
        </div>
      </div>
    </main>
  );
} 