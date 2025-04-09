import AccountManagement from '@/components/AccountManagement';
import ApiKeyManagement from '@/components/ApiKeyManagement';
import ComponentLibrary from '@/components/ComponentLibrary';

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <AccountManagement />
        <ApiKeyManagement />
        <ComponentLibrary />
      </div>
    </main>
  );
} 