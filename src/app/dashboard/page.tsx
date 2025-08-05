'use client';

import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-black mb-4">
                    Welcome to your Dashboard!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You are successfully authenticated with Firebase.
                  </p>
                  <div className="bg-white p-6 rounded-lg shadow text-black">
                    <h3 className="text-lg font-semibold mb-2">User Information:</h3>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>UID:</strong> {user?.uid}</p>
                    <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
                    <p><strong>Creation Time:</strong> {user?.metadata.creationTime}</p>
                    <p><strong>Last Sign In:</strong> {user?.metadata.lastSignInTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
