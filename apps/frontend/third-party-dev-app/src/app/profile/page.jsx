import ProfileCard from '@/components/ProfileCard';
import AccountSettings from '@/components/AccountSettings';

export default function Profile() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileCard />
        </div>
        <div className="md:col-span-2">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              {/* TODO: Implémenter l'historique des activités */}
              <p className="text-gray-500">No recent activity</p>
            </div>
            <AccountSettings />
          </div>
        </div>
      </div>
    </main>
  );
} 